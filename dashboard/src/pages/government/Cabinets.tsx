import { useTable } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useDelete, useUpdate } from "@refinedev/core";

interface Cabinet {
  id: string;
  cabinet_code: string;
  location_name: string;
  location_lat: number;
  location_lng: number;
  total_slots: number;
  status: string;
}

export const Cabinets = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Cabinet | null>(null);
  const [form] = Form.useForm();
  const { mutate: updateMutate } = useUpdate();
  const { mutate: deleteMutate } = useDelete();

  const { tableProps } = useTable<Cabinet>({
    resource: "cabinets",
  });

  const handleEdit = (record: Cabinet) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个柜机吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteMutate({
          resource: "cabinets",
          id,
        }, {
          onSuccess: () => {
            message.success("删除成功");
          },
        });
      },
    });
  };

  const handleEditFinish = (values: any) => {
    if (!editingRecord) return;
    updateMutate({
      resource: "cabinets",
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

  const columns: ColumnsType<Cabinet> = [
    {
      title: "柜机编号",
      dataIndex: "cabinet_code",
      key: "cabinet_code",
    },
    {
      title: "位置名称",
      dataIndex: "location_name",
      key: "location_name",
    },
    {
      title: "经度",
      dataIndex: "location_lng",
      key: "location_lng",
    },
    {
      title: "纬度",
      dataIndex: "location_lat",
      key: "location_lat",
    },
    {
      title: "槽位数量",
      dataIndex: "total_slots",
      key: "total_slots",
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
          background: status === "online" ? "#DCFCE7" : status === "offline" ? "#FEE2E2" : "#FEF3C7",
          color: status === "online" ? "#166534" : status === "offline" ? "#991B1B" : "#92400E",
        }}>
          {status === "online" ? "在线" : status === "offline" ? "离线" : "维护中"}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Cabinet) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>柜机管理</h2>
      <Table {...tableProps} columns={columns} rowKey="id" />

      <Modal
        title="编辑柜机"
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item label="柜机编号" name="cabinet_code">
            <Input disabled />
          </Form.Item>
          <Form.Item label="位置名称" name="location_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="经度" name="location_lng" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="纬度" name="location_lat" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="槽位数量" name="total_slots" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="online">在线</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
              <Select.Option value="maintenance">维护中</Select.Option>
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
    </div>
  );
};