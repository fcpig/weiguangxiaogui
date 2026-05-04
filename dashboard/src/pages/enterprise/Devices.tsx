import { useTable } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input, Select, Tag, message, Card, Row, Col, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useMemo } from "react";
import { useDelete, useUpdate, useCreate, useGetIdentity } from "@refinedev/core";
import { Package, AlertTriangle, CheckCircle2, Clock, Store } from "lucide-react";

interface Item {
  id: string;
  cabinet_id: string;
  item_name: string;
  category: string;
  current_quantity: number;
  max_capacity: number;
  expire_time: string;
  status: string;
}

// Demo data for devices
const demoItems: Item[] = [
  {
    id: "1",
    cabinet_id: "YM-001",
    item_name: "有机大米 5kg",
    category: "food",
    current_quantity: 8,
    max_capacity: 20,
    expire_time: "2026-04-25",
    status: "available",
  },
  {
    id: "2",
    cabinet_id: "YM-001",
    item_name: "纯牛奶 250ml*12",
    category: "drink",
    current_quantity: 12,
    max_capacity: 24,
    expire_time: "2026-04-25",
    status: "available",
  },
  {
    id: "3",
    cabinet_id: "YM-002",
    item_name: "全麦面包",
    category: "food",
    current_quantity: 5,
    max_capacity: 15,
    expire_time: "2026-04-23",
    status: "available",
  },
  {
    id: "4",
    cabinet_id: "YM-001",
    item_name: "矿泉水 550ml*24",
    category: "drink",
    current_quantity: 20,
    max_capacity: 30,
    expire_time: "2026-04-26",
    status: "available",
  },
  {
    id: "5",
    cabinet_id: "YM-002",
    item_name: "方便面 5连包",
    category: "food",
    current_quantity: 15,
    max_capacity: 25,
    expire_time: "2026-04-28",
    status: "available",
  },
  {
    id: "6",
    cabinet_id: "YM-001",
    item_name: "食用油 5L",
    category: "food",
    current_quantity: 6,
    max_capacity: 12,
    expire_time: "2026-06-15",
    status: "available",
  },
  {
    id: "7",
    cabinet_id: "YM-002",
    item_name: "洗洁精 500ml",
    category: "daily",
    current_quantity: 10,
    max_capacity: 20,
    expire_time: "2026-05-20",
    status: "removed",
  },
  {
    id: "8",
    cabinet_id: "YM-003",
    item_name: "酸奶 180ml*4",
    category: "drink",
    current_quantity: 15,
    max_capacity: 30,
    expire_time: "2026-04-22",
    status: "available",
  },
  {
    id: "9",
    cabinet_id: "YM-002",
    item_name: "八宝粥 360g*6",
    category: "food",
    current_quantity: 18,
    max_capacity: 24,
    expire_time: "2026-04-27",
    status: "available",
  },
  {
    id: "10",
    cabinet_id: "YM-003",
    item_name: "饼干礼盒",
    category: "food",
    current_quantity: 10,
    max_capacity: 15,
    expire_time: "2026-04-28",
    status: "available",
  },
  {
    id: "11",
    cabinet_id: "YM-002",
    item_name: "蛋糕卷 500g",
    category: "food",
    current_quantity: 6,
    max_capacity: 12,
    expire_time: "2026-04-20",
    status: "expired",
  },
  {
    id: "12",
    cabinet_id: "YM-002",
    item_name: "粉丝 300g",
    category: "food",
    current_quantity: 0,
    max_capacity: 20,
    expire_time: "2026-05-15",
    status: "finished",
  },
  {
    id: "13",
    cabinet_id: "YM-003",
    item_name: "洗衣液 2kg",
    category: "daily",
    current_quantity: 8,
    max_capacity: 16,
    expire_time: "2026-04-10",
    status: "available",
  },
  {
    id: "14",
    cabinet_id: "YM-001",
    item_name: "抽纸 3层*6包",
    category: "daily",
    current_quantity: 25,
    max_capacity: 40,
    expire_time: "2026-06-01",
    status: "available",
  },
  {
    id: "15",
    cabinet_id: "YM-002",
    item_name: "挂面 1kg",
    category: "food",
    current_quantity: 30,
    max_capacity: 40,
    expire_time: "2026-07-01",
    status: "available",
  },
];

export const Devices = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Item | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const { mutate: updateMutate } = useUpdate();
  const { mutate: deleteMutate } = useDelete();
  const { mutate: createMutate } = useCreate();
  const { data: identity } = useGetIdentity<{ merchantId?: string }>();

  const merchantId = identity?.merchantId;

  const { tableProps } = useTable<Item>({
    resource: "items",
    filters: {
      permanent: merchantId ? [
        { field: "merchant_id", operator: "eq", value: merchantId }
      ] : [],
    },
  });

  // Calculate stats from demo data
  const stats = useMemo(() => {
    const totalItems = demoItems.length;
    const availableItems = demoItems.filter(item => item.status === "available").length;
    const expiredItems = demoItems.filter(item => item.status === "expired").length;
    const lowStockItems = demoItems.filter(item => {
      const percent = (item.current_quantity / item.max_capacity) * 100;
      return item.status === "available" && percent < 40;
    }).length;
    
    return {
      totalItems,
      availableItems,
      expiredItems,
      lowStockItems,
    };
  }, []);

  const handleEdit = (record: Item) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个物资吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteMutate({
          resource: "items",
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
      resource: "items",
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

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleCreateFinish = (values: any) => {
    createMutate({
      resource: "items",
      values,
    }, {
      onSuccess: () => {
        message.success("添加成功");
        setIsAddOpen(false);
        createForm.resetFields();
      },
    });
  };

  const columns: ColumnsType<Item> = [
    {
      title: "物资名称",
      dataIndex: "item_name",
      key: "item_name",
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: "所属柜机",
      dataIndex: "cabinet_id",
      key: "cabinet_id",
      render: (cabinet_id: string) => (
        <Tag color="blue" icon={<Store size={12} style={{ marginRight: '4px' }} />}>
          {cabinet_id}
        </Tag>
      ),
    },
    {
      title: "类别",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        const colorMap: Record<string, string> = {
          food: "orange",
          drink: "blue",
          daily: "green",
        };
        const labelMap: Record<string, string> = {
          food: "食品",
          drink: "饮料",
          daily: "日用品",
        };
        return <Tag color={colorMap[category]}>{labelMap[category] || category}</Tag>;
      },
    },
    {
      title: "当前库存",
      dataIndex: "current_quantity",
      key: "current_quantity",
      render: (current: number, record: Item) => {
        const percent = Math.round((current / record.max_capacity) * 100);
        let color = "#10B981";
        if (percent < 30) color = "#DC2626";
        else if (percent < 50) color = "#D97706";
        return (
          <div>
            <span style={{ color, fontWeight: 600 }}>{current}</span>
            <span style={{ color: "#94A3B8", fontSize: "12px", marginLeft: "8px" }}>
              / {record.max_capacity}
            </span>
          </div>
        );
      },
    },
    {
      title: "库存进度",
      key: "progress",
      width: 120,
      render: (_: any, record: Item) => {
        const percent = Math.round((record.current_quantity / record.max_capacity) * 100);
        let strokeColor = "#10B981";
        if (percent < 30) strokeColor = "#DC2626";
        else if (percent < 50) strokeColor = "#D97706";
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: strokeColor,
                  borderRadius: '3px',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>{percent}%</span>
          </div>
        );
      },
    },
    {
      title: "到期时间",
      dataIndex: "expire_time",
      key: "expire_time",
      render: (date: string) => {
        const expiryDate = new Date(date);
        const today = new Date();
        const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let color = "#64748B";
        let icon = null;
        if (daysDiff < 0) {
          color = "#DC2626";
          icon = <AlertTriangle size={12} style={{ marginRight: '4px' }} />;
        } else if (daysDiff <= 3) {
          color = "#D97706";
          icon = <Clock size={12} style={{ marginRight: '4px' }} />;
        }
        
        return (
          <span style={{ color, fontSize: '13px', display: 'flex', alignItems: 'center' }}>
            {icon}
            {new Date(date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          available: "success",
          expired: "error",
          removed: "default",
          finished: "warning",
        };
        const labelMap: Record<string, string> = {
          available: "可用",
          expired: "已过期",
          removed: "已下架",
          finished: "已领完",
        };
        return <Tag color={colorMap[status]}>{labelMap[status] || status}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Item) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        物资管理
      </h2>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #1E40AF',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>物资总数</span>}
              value={stats.totalItems}
              valueStyle={{ color: '#1E40AF', fontSize: '28px', fontWeight: 700 }}
              prefix={<Package size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #10B981',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>可用物资</span>}
              value={stats.availableItems}
              valueStyle={{ color: '#059669', fontSize: '28px', fontWeight: 700 }}
              prefix={<CheckCircle2 size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #DC2626',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>已过期</span>}
              value={stats.expiredItems}
              valueStyle={{ color: '#DC2626', fontSize: '28px', fontWeight: 700 }}
              prefix={<AlertTriangle size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #D97706',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>库存偏低</span>}
              value={stats.lowStockItems}
              valueStyle={{ color: '#D97706', fontSize: '28px', fontWeight: 700 }}
              prefix={<Clock size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Button type="primary" onClick={handleAdd} size="large">+ 添加物资</Button>
      </div>
      
      <Card style={{ borderRadius: '12px' }}>
        <Table
          {...tableProps}
          dataSource={demoItems}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      </Card>

      <Modal
        title="编辑物资"
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item label="物资名称" name="item_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="所属柜机" name="cabinet_id" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="类别" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="food">食品</Select.Option>
              <Select.Option value="drink">饮料</Select.Option>
              <Select.Option value="daily">日用品</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="当前库存" name="current_quantity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="最大容量" name="max_capacity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="到期时间" name="expire_time" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="available">可用</Select.Option>
              <Select.Option value="expired">已过期</Select.Option>
              <Select.Option value="removed">已下架</Select.Option>
              <Select.Option value="finished">已领完</Select.Option>
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
        title="添加物资"
        open={isAddOpen}
        onCancel={() => {
          setIsAddOpen(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateFinish}>
          <Form.Item label="物资名称" name="item_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="所属柜机" name="cabinet_id" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="类别" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="food">食品</Select.Option>
              <Select.Option value="drink">饮料</Select.Option>
              <Select.Option value="daily">日用品</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="当前库存" name="current_quantity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="最大容量" name="max_capacity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="到期时间" name="expire_time" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="available">可用</Select.Option>
              <Select.Option value="expired">已过期</Select.Option>
              <Select.Option value="removed">已下架</Select.Option>
              <Select.Option value="finished">已领完</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">添加</Button>
              <Button onClick={() => { setIsAddOpen(false); createForm.resetFields(); }}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
