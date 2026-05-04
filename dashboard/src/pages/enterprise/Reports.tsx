import { useTable } from "@refinedev/antd";
import { Table, Tag, Card, Row, Col, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetIdentity } from "@refinedev/core";
import { useMemo } from "react";
import { Package, TrendingUp, Calendar, Store } from "lucide-react";

interface Item {
  id: string;
  cabinet_id: string;
  item_code: string;
  item_name: string;
  category: string;
  current_quantity: number;
  max_capacity: number;
  put_time: string;
  status: string;
}

// Demo data for reports
const demoItems: Item[] = [
  {
    id: "1",
    cabinet_id: "YM-001",
    item_code: "ITEM-2024-001",
    item_name: "有机大米 5kg",
    category: "food",
    current_quantity: 8,
    max_capacity: 20,
    put_time: "2026-04-15T10:30:00",
    status: "available",
  },
  {
    id: "2",
    cabinet_id: "YM-001",
    item_code: "ITEM-2024-002",
    item_name: "纯牛奶 250ml*12",
    category: "drink",
    current_quantity: 12,
    max_capacity: 24,
    put_time: "2026-04-16T09:15:00",
    status: "available",
  },
  {
    id: "3",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-003",
    item_name: "全麦面包",
    category: "food",
    current_quantity: 5,
    max_capacity: 15,
    put_time: "2026-04-14T11:00:00",
    status: "available",
  },
  {
    id: "4",
    cabinet_id: "YM-001",
    item_code: "ITEM-2024-004",
    item_name: "矿泉水 550ml*24",
    category: "drink",
    current_quantity: 20,
    max_capacity: 30,
    put_time: "2026-04-18T14:20:00",
    status: "available",
  },
  {
    id: "5",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-005",
    item_name: "方便面 5连包",
    category: "food",
    current_quantity: 15,
    max_capacity: 25,
    put_time: "2026-04-17T16:45:00",
    status: "available",
  },
  {
    id: "6",
    cabinet_id: "YM-001",
    item_code: "ITEM-2024-006",
    item_name: "食用油 5L",
    category: "food",
    current_quantity: 6,
    max_capacity: 12,
    put_time: "2026-04-19T08:30:00",
    status: "available",
  },
  {
    id: "7",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-007",
    item_name: "洗洁精 500ml",
    category: "daily",
    current_quantity: 10,
    max_capacity: 20,
    put_time: "2026-04-13T10:00:00",
    status: "removed",
  },
  {
    id: "8",
    cabinet_id: "YM-003",
    item_code: "ITEM-2024-008",
    item_name: "酸奶 180ml*4",
    category: "drink",
    current_quantity: 15,
    max_capacity: 30,
    put_time: "2026-04-12T09:00:00",
    status: "available",
  },
  {
    id: "9",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-009",
    item_name: "八宝粥 360g*6",
    category: "food",
    current_quantity: 18,
    max_capacity: 24,
    put_time: "2026-04-20T11:30:00",
    status: "available",
  },
  {
    id: "10",
    cabinet_id: "YM-003",
    item_code: "ITEM-2024-010",
    item_name: "饼干礼盒",
    category: "food",
    current_quantity: 10,
    max_capacity: 15,
    put_time: "2026-04-21T13:00:00",
    status: "available",
  },
  {
    id: "11",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-011",
    item_name: "蛋糕卷 500g",
    category: "food",
    current_quantity: 6,
    max_capacity: 12,
    put_time: "2026-04-10T15:00:00",
    status: "expired",
  },
  {
    id: "12",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-012",
    item_name: "粉丝 300g",
    category: "food",
    current_quantity: 0,
    max_capacity: 20,
    put_time: "2026-04-08T09:30:00",
    status: "finished",
  },
  {
    id: "13",
    cabinet_id: "YM-003",
    item_code: "ITEM-2024-013",
    item_name: "洗衣液 2kg",
    category: "daily",
    current_quantity: 8,
    max_capacity: 16,
    put_time: "2026-04-11T14:00:00",
    status: "available",
  },
  {
    id: "14",
    cabinet_id: "YM-001",
    item_code: "ITEM-2024-014",
    item_name: "抽纸 3层*6包",
    category: "daily",
    current_quantity: 25,
    max_capacity: 40,
    put_time: "2026-04-22T10:00:00",
    status: "available",
  },
  {
    id: "15",
    cabinet_id: "YM-002",
    item_code: "ITEM-2024-015",
    item_name: "挂面 1kg",
    category: "food",
    current_quantity: 30,
    max_capacity: 40,
    put_time: "2026-04-23T08:00:00",
    status: "available",
  },
];

export const Reports = () => {
  const { data: identity } = useGetIdentity<{ merchantId?: string }>();
  const merchantId = identity?.merchantId;

  const { tableProps } = useTable<Item>({
    resource: "items",
    filters: {
      permanent: merchantId ? [
        { field: "merchant_id", operator: "eq", value: merchantId }
      ] : [],
    },
    sorters: {
      initial: [
        { field: "put_time", order: "desc" }
      ]
    }
  });

  // Calculate stats from demo data
  const stats = useMemo(() => {
    const totalItems = demoItems.length;
    const totalQuantity = demoItems.reduce((sum, item) => sum + item.max_capacity, 0);
    const availableItems = demoItems.filter(item => item.status === "available").length;
    const cabinets = [...new Set(demoItems.map(item => item.cabinet_id))].length;
    
    return {
      totalItems,
      totalQuantity,
      availableItems,
      cabinets,
    };
  }, []);

  const columns: ColumnsType<Item> = [
    {
      title: "物资编码",
      dataIndex: "item_code",
      key: "item_code",
    },
    {
      title: "物资名称",
      dataIndex: "item_name",
      key: "item_name",
    },
    {
      title: "所属柜机",
      dataIndex: "cabinet_id",
      key: "cabinet_id",
      render: (cabinet_id: string) => (
        <Tag color="blue">{cabinet_id}</Tag>
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
      title: "投放数量",
      dataIndex: "max_capacity",
      key: "max_capacity",
    },
    {
      title: "剩余数量",
      dataIndex: "current_quantity",
      key: "current_quantity",
      render: (current: number, record: Item) => {
        const percent = Math.round((current / record.max_capacity) * 100);
        let color = "#10B981";
        if (percent < 30) color = "#DC2626";
        else if (percent < 60) color = "#D97706";
        
        return (
          <div>
            <span style={{ color, fontWeight: 600 }}>{current}</span>
            <span style={{ color: "#94A3B8", fontSize: "12px", marginLeft: "8px" }}>
              ({percent}%)
            </span>
          </div>
        );
      },
    },
    {
      title: "投放时间",
      dataIndex: "put_time",
      key: "put_time",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
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
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        投放记录
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
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>投放物资总数</span>}
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
              borderLeft: '4px solid #059669',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>累计投放数量</span>}
              value={stats.totalQuantity}
              valueStyle={{ color: '#059669', fontSize: '28px', fontWeight: 700 }}
              prefix={<TrendingUp size={20} style={{ marginRight: '8px' }} />}
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
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>可用物资数</span>}
              value={stats.availableItems}
              valueStyle={{ color: '#D97706', fontSize: '28px', fontWeight: 700 }}
              prefix={<Calendar size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #7C3AED',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: '#64748B', fontSize: '14px' }}>覆盖柜机数</span>}
              value={stats.cabinets}
              valueStyle={{ color: '#7C3AED', fontSize: '28px', fontWeight: 700 }}
              prefix={<Store size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

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
    </div>
  );
};
