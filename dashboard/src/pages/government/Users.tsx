import { useTable } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input, Select, Tag, message, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useDelete, useUpdate, useCreate } from "@refinedev/core";
import { Upload as UploadIcon, FileText, X } from "lucide-react";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

interface User {
  id: string;
  phone: string;
  name: string;
  user_type: string;
  status: string;
  created_at: string;
}

interface ImportRow {
  phone: string;
  name: string;
  user_type: string;
  status: string;
}

const CSV_HEADERS = ["phone", "name", "user_type", "status"];

export const Users = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [importFile, setImportFile] = useState<UploadFile | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { mutate: updateMutate } = useUpdate();
  const { mutate: deleteMutate } = useDelete();
  const { mutate: createMutate } = useCreate();

  const { tableProps } = useTable<User>({
    resource: "users",
  });

  const handleEdit = (record: User) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个用户吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteMutate({
          resource: "users",
          id,
        }, {
          onSuccess: () => {
            message.success("删除成功");
          },
        });
      },
    });
  };

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    const data: ImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      if (row.phone && row.name) {
        data.push({
          phone: row.phone || "",
          name: row.name || "",
          user_type: row.user_type || "vulnerable",
          status: row.status || "active",
        });
      }
    }
    return data;
  };

  const handleFileChange: UploadProps["onChange"] = (info) => {
    const file = info.file.originFileObj || info.file as any;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseCSV(text);
      setImportData(data);
      setImportFile(info.file as UploadFile);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (importData.length === 0) {
      message.warning("请先上传文件");
      return;
    }
    setIsImporting(true);

    let successCount = 0;
    let failCount = 0;
    let completed = 0;

    importData.forEach((row) => {
      createMutate(
        {
          resource: "users",
          values: row,
        },
        {
          onSuccess: () => {
            successCount++;
            completed++;
            if (completed === importData.length) {
              setIsImporting(false);
              message.success(`成功导入 ${successCount} 条数据${failCount > 0 ? `，失败 ${failCount} 条` : ""}`);
              setIsImportOpen(false);
              setImportFile(null);
              setImportData([]);
            }
          },
          onError: () => {
            failCount++;
            completed++;
            if (completed === importData.length) {
              setIsImporting(false);
              message.success(`成功导入 ${successCount} 条数据${failCount > 0 ? `，失败 ${failCount} 条` : ""}`);
              setIsImportOpen(false);
              setImportFile(null);
              setImportData([]);
            }
          },
        }
      );
    });
  };

  const resetImportModal = () => {
    setIsImportOpen(false);
    setImportFile(null);
    setImportData([]);
  };

  const handleEditFinish = (values: any) => {
    if (!editingRecord) return;
    updateMutate({
      resource: "users",
      id: editingRecord.id,
      values,
    }, {
      onSuccess: () => {
        message.success("更新成功");
        setIsEditOpen(false);
        setEditingRecord(null);
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "用户类型",
      dataIndex: "user_type",
      key: "user_type",
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          admin: "purple",
          merchant: "blue",
          vulnerable: "green",
        };
        const labelMap: Record<string, string> = {
          admin: "管理员",
          merchant: "爱心商户",
          vulnerable: "困难群体",
        };
        return <Tag color={colorMap[type]}>{labelMap[type] || type}</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          background: status === "active" ? "#DCFCE7" : "#FEE2E2",
          color: status === "active" ? "#166534" : "#991B1B",
        }}>
          {status === "active" ? "正常" : "禁用"}
        </span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>用户管理</h2>
        <Button type="primary" icon={<UploadIcon size={16} />} onClick={() => setIsImportOpen(true)}>
          批量导入
        </Button>
      </div>
      <Table {...tableProps} columns={columns} rowKey="id" />

      <Modal
        title="编辑用户"
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item label="手机号" name="phone">
            <Input disabled />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="用户类型" name="user_type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="merchant">爱心商户</Select.Option>
              <Select.Option value="vulnerable">困难群体</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => { setIsEditOpen(false); setEditingRecord(null); }}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="批量导入用户"
        open={isImportOpen}
        onCancel={resetImportModal}
        footer={null}
        width={700}
      >
        <div style={{ padding: "16px 0" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ marginBottom: "8px", fontWeight: 500, color: "#374151" }}>
              上传 CSV 文件
            </div>
            <Upload.Dragger
              accept=".csv"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
              style={{ borderRadius: "8px" }}
            >
              <div style={{ padding: "24px" }}>
                <FileText size={40} color="#9CA3AF" style={{ marginBottom: "12px" }} />
                <p style={{ color: "#6B7280", margin: "0 0 8px 0", fontSize: "14px" }}>
                  点击或拖拽 CSV 文件到此区域
                </p>
                <p style={{ color: "#9CA3AF", margin: 0, fontSize: "12px" }}>
                  支持 CSV 格式文件
                </p>
              </div>
            </Upload.Dragger>
          </div>

          {importFile && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "#F3F4F6",
                borderRadius: "8px",
                marginBottom: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FileText size={20} color="#6B7280" />
                  <span style={{ fontWeight: 500, color: "#374151" }}>{importFile.name}</span>
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>
                    ({importData.length} 条数据)
                  </span>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<X size={16} />}
                  onClick={() => {
                    setImportFile(null);
                    setImportData([]);
                  }}
                />
              </div>

              <div style={{ marginBottom: "8px", fontWeight: 500, color: "#374151" }}>
                数据预览
              </div>
              <Table
                dataSource={importData.slice(0, 5)}
                rowKey={(_, index) => String(index)}
                pagination={false}
                size="small"
                columns={[
                  { title: "手机号", dataIndex: "phone", key: "phone" },
                  { title: "姓名", dataIndex: "name", key: "name" },
                  {
                    title: "用户类型",
                    dataIndex: "user_type",
                    key: "user_type",
                    render: (type: string) => {
                      const labelMap: Record<string, string> = {
                        admin: "管理员",
                        merchant: "爱心商户",
                        vulnerable: "困难群体",
                      };
                      return labelMap[type] || type;
                    }
                  },
                  {
                    title: "状态",
                    dataIndex: "status",
                    key: "status",
                    render: (status: string) => (
                      <span style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        background: status === "active" ? "#DCFCE7" : "#FEE2E2",
                        color: status === "active" ? "#166534" : "#991B1B",
                      }}>
                        {status === "active" ? "正常" : "禁用"}
                      </span>
                    )
                  },
                ]}
                style={{ marginBottom: "8px" }}
              />
              {importData.length > 5 && (
                <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>
                  还有 {importData.length - 5} 条数据...
                </div>
              )}
            </div>
          )}

          <div style={{
            background: "#EFF6FF",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "24px"
          }}>
            <div style={{ fontWeight: 500, color: "#1E40AF", marginBottom: "4px", fontSize: "13px" }}>
              CSV 文件格式要求
            </div>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "12px", color: "#1E40AF" }}>
              <li>第一行为表头，包含字段：phone, name, user_type, status</li>
              <li>user_type 可选值：admin, merchant, vulnerable（默认为 vulnerable）</li>
              <li>status 可选值：active, inactive（默认为 active）</li>
            </ul>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button onClick={resetImportModal}>取消</Button>
            <Button
              type="primary"
              loading={isImporting}
              disabled={importData.length === 0}
              onClick={handleImport}
            >
              确认导入
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};