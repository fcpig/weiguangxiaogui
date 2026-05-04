import { useTable } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useDelete, useUpdate } from "@refinedev/core";

interface Merchant {
  id: string;
  merchant_code: string;
  merchant_name: string;
  contact_person: string;
  contact_phone: string;
  address: string;
  status: string;
  total_donations: number;
}

export const Merchants = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Merchant | null>(null);
  const [form] = Form.useForm();
  const { mutate: updateMutate } = useUpdate();
  const { mutate: deleteMutate } = useDelete();

  const { tableProps } = useTable<Merchant>({
    resource: "merchants",
  });

  const handleEdit = (record: Merchant) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个商户吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteMutate({
          resource: "merchants",
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
      resource: "merchants",
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

  const columns: ColumnsType<Merchant> = [
    {
      title: "商户编号",
      dataIndex: "merchant_code",
      key: "merchant_code",
    },
    {
      title: "商户名称",
      dataIndex: "merchant_name",
      key: "merchant_name",
    },
    {
      title: "联系人",
      dataIndex: "contact_person",
      key: "contact_person",
    },
    {
      title: "联系电话",
      dataIndex: "contact_phone",
      key: "contact_phone",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "总捐赠次数",
      dataIndex: "total_donations",
      key: "total_donations",
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
      title: "操作",
      key: "action",
      render: (_: any, record: Merchant) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>爱心商户管理</h2>
      <Table {...tableProps} columns={columns} rowKey="id" />

      <Modal
        title="编辑商户"
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item label="商户编号" name="merchant_code">
            <Input disabled />
          </Form.Item>
          <Form.Item label="商户名称" name="merchant_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="联系人" name="contact_person" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="联系电话" name="contact_phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="address" rules={[{ required: true }]}>
            <Input />
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
    </div>
  );
};