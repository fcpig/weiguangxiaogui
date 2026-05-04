import { Table, Tag, Space, Button, Modal, message, Card, Row, Col, Statistic, Tabs, Badge, Tooltip, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetIdentity, useUpdate, useCustom } from "@refinedev/core";
import { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Package, 
  Bell, 
  Calendar,
  Store,
  MapPin,
  ArrowRight
} from "lucide-react";

interface ExpiryAlert {
  id: string;
  item_id: string;
  item_name: string;
  cabinet_code: string;
  cabinet_location: string;
  merchant_id: string;
  merchant_name: string;
  expiry_date: string;
  alert_status: "pending" | "notified" | "processed" | "removed";
  alert_type: "expiring_soon" | "expired" | "critical";
  days_remaining: number;
  quantity: number;
  category: string;
  created_at: string;
  notified_at?: string;
  processed_at?: string;
}

// Demo data for enterprise
const demoExpiryAlerts: ExpiryAlert[] = [
  // 紧急临期 - 今天/明天到期
  {
    id: "1",
    item_id: "ITEM-2024-001",
    item_name: "有机大米 5kg",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-25",
    alert_status: "pending",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 8,
    category: "food",
    created_at: "2026-04-20T08:30:00",
  },
  {
    id: "2",
    item_id: "ITEM-2024-002",
    item_name: "纯牛奶 250ml*12",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-25",
    alert_status: "notified",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 12,
    category: "drink",
    created_at: "2026-04-19T09:15:00",
    notified_at: "2026-04-23T10:00:00",
  },
  // 已过期
  {
    id: "3",
    item_id: "ITEM-2024-003",
    item_name: "全麦面包",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-23",
    alert_status: "pending",
    alert_type: "expired",
    days_remaining: -1,
    quantity: 5,
    category: "food",
    created_at: "2026-04-18T10:00:00",
  },
  {
    id: "8",
    item_id: "ITEM-2024-008",
    item_name: "酸奶 180ml*4",
    cabinet_code: "YM-003",
    cabinet_location: "扬名街道老年活动中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-22",
    alert_status: "pending",
    alert_type: "expired",
    days_remaining: -2,
    quantity: 15,
    category: "drink",
    created_at: "2026-04-17T11:00:00",
  },
  // 临期紧急 - 2-3天内到期
  {
    id: "4",
    item_id: "ITEM-2024-004",
    item_name: "矿泉水 550ml*24",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-26",
    alert_status: "notified",
    alert_type: "expiring_soon",
    days_remaining: 2,
    quantity: 20,
    category: "drink",
    created_at: "2026-04-21T11:20:00",
  },
  {
    id: "9",
    item_id: "ITEM-2024-009",
    item_name: "八宝粥 360g*6",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-27",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 3,
    quantity: 18,
    category: "food",
    created_at: "2026-04-22T09:00:00",
  },
  {
    id: "5",
    item_id: "ITEM-2024-005",
    item_name: "方便面 5连包",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-28",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 4,
    quantity: 15,
    category: "food",
    created_at: "2026-04-22T14:45:00",
  },
  {
    id: "10",
    item_id: "ITEM-2024-010",
    item_name: "饼干礼盒",
    cabinet_code: "YM-003",
    cabinet_location: "扬名街道老年活动中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-28",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 4,
    quantity: 10,
    category: "food",
    created_at: "2026-04-23T08:00:00",
  },
  // 长期未处理 - 已提醒状态
  {
    id: "11",
    item_id: "ITEM-2024-011",
    item_name: "蛋糕卷 500g",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-20",
    alert_status: "notified",
    alert_type: "expired",
    days_remaining: -4,
    quantity: 6,
    category: "food",
    created_at: "2026-04-15T10:00:00",
    notified_at: "2026-04-20T14:00:00",
  },
  // 已处理记录
  {
    id: "12",
    item_id: "ITEM-2024-012",
    item_name: "粉丝 300g",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-15",
    alert_status: "processed",
    alert_type: "expired",
    days_remaining: -9,
    quantity: 20,
    category: "food",
    created_at: "2026-04-10T09:00:00",
    notified_at: "2026-04-14T11:00:00",
    processed_at: "2026-04-15T16:30:00",
  },
  {
    id: "13",
    item_id: "ITEM-2024-013",
    item_name: "洗衣液 2kg",
    cabinet_code: "YM-003",
    cabinet_location: "扬名街道老年活动中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-10",
    alert_status: "processed",
    alert_type: "expired",
    days_remaining: -14,
    quantity: 8,
    category: "daily",
    created_at: "2026-04-05T14:00:00",
    notified_at: "2026-04-08T10:00:00",
    processed_at: "2026-04-10T09:00:00",
  },
  // 已下架记录
  {
    id: "7",
    item_id: "ITEM-2024-007",
    item_name: "洗洁精 500ml",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-05-20",
    alert_status: "removed",
    alert_type: "expiring_soon",
    days_remaining: 26,
    quantity: 10,
    category: "daily",
    created_at: "2026-04-20T08:00:00",
    notified_at: "2026-04-22T10:00:00",
    processed_at: "2026-04-23T09:00:00",
  },
  {
    id: "14",
    item_id: "ITEM-2024-014",
    item_name: "抽纸 3层*6包",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-06-01",
    alert_status: "removed",
    alert_type: "expiring_soon",
    days_remaining: 38,
    quantity: 25,
    category: "daily",
    created_at: "2026-04-18T11:00:00",
    notified_at: "2026-04-25T09:00:00",
    processed_at: "2026-04-26T14:00:00",
  },
  // 安全期内物资（不在预警列表主要显示区域）
  {
    id: "6",
    item_id: "ITEM-2024-006",
    item_name: "食用油 5L",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-06-15",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 52,
    quantity: 6,
    category: "food",
    created_at: "2026-04-23T16:30:00",
  },
  {
    id: "15",
    item_id: "ITEM-2024-015",
    item_name: "挂面 1kg",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-07-01",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 68,
    quantity: 30,
    category: "food",
    created_at: "2026-04-24T10:00:00",
  },
];

export const EnterpriseMessages = () => {
  const { data: identity } = useGetIdentity<{ merchantId?: string }>();
  const merchantId = identity?.merchantId;
  const { mutate: updateMutate } = useUpdate();
  const [activeTab, setActiveTab] = useState("all");
  const [alerts, setAlerts] = useState<ExpiryAlert[]>(demoExpiryAlerts);

  // Filter alerts for current merchant
  const filteredAlerts = useMemo(() => {
    if (!merchantId) return alerts;
    return alerts.filter(alert => alert.merchant_id === merchantId);
  }, [alerts, merchantId]);

  // Statistics
  const stats = useMemo(() => {
    const data = filteredAlerts;
    return {
      total: data.length,
      pending: data.filter(a => a.alert_status === "pending").length,
      notified: data.filter(a => a.alert_status === "notified").length,
      processed: data.filter(a => a.alert_status === "processed").length,
      critical: data.filter(a => a.alert_type === "critical" || a.alert_type === "expired").length,
    };
  }, [filteredAlerts]);

  // Tab filtered data
  const tabFilteredAlerts = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return filteredAlerts.filter(a => a.alert_status === "pending");
      case "notified":
        return filteredAlerts.filter(a => a.alert_status === "notified");
      case "processed":
        return filteredAlerts.filter(a => a.alert_status === "processed" || a.alert_status === "removed");
      case "critical":
        return filteredAlerts.filter(a => a.alert_type === "critical" || a.alert_type === "expired");
      default:
        return filteredAlerts;
    }
  }, [filteredAlerts, activeTab]);

  const handleNotify = (record: ExpiryAlert) => {
    Modal.confirm({
      title: "确认提醒",
      content: `确定要发送取走提醒给相关管理人员吗？\n\n物资：${record.item_name}\n柜机：${record.cabinet_code}\n位置：${record.cabinet_location}`,
      okText: "确认发送",
      cancelText: "取消",
      onOk: () => {
        setAlerts(prev =>
          prev.map(alert =>
            alert.id === record.id 
              ? { ...alert, alert_status: "notified", notified_at: new Date().toISOString() } 
              : alert
          )
        );
        message.success("提醒已发送，请尽快前往柜机取走临期物资");
      },
    });
  };

  const handleRemove = (record: ExpiryAlert) => {
    Modal.confirm({
      title: "确认下架",
      content: `确定要下架该物资吗？下架后物资将不再显示在柜机中。\n\n物资：${record.item_name}\n数量：${record.quantity}`,
      okText: "确认下架",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        setAlerts(prev =>
          prev.map(alert =>
            alert.id === record.id 
              ? { ...alert, alert_status: "removed", processed_at: new Date().toISOString() } 
              : alert
          )
        );
        message.success("物资已下架，请及时前往柜机取走");
      },
    });
  };

  const handleProcess = (record: ExpiryAlert) => {
    Modal.confirm({
      title: "确认处理",
      content: `确定已处理该临期物资提醒吗？\n\n物资：${record.item_name}`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        setAlerts(prev =>
          prev.map(alert =>
            alert.id === record.id 
              ? { ...alert, alert_status: "processed", processed_at: new Date().toISOString() } 
              : alert
          )
        );
        message.success("处理成功");
      },
    });
  };

  const getAlertTypeTag = (type: string, days: number) => {
    const config: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      expired: { color: "#DC2626", icon: <AlertTriangle size={14} />, text: "已过期" },
      critical: { color: "#EA580C", icon: <Clock size={14} />, text: days <= 1 ? "即将到期" : "临期紧急" },
      expiring_soon: { color: "#D97706", icon: <Calendar size={14} />, text: "临期提醒" },
    };
    const cfg = config[type] || config.expiring_soon;
    return (
      <Tag color={cfg.color} icon={cfg.icon} style={{ borderRadius: '4px' }}>
        {cfg.text}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      pending: { color: "orange", text: "待处理" },
      notified: { color: "blue", text: "已提醒" },
      processed: { color: "green", text: "已处理" },
      removed: { color: "red", text: "已下架" },
    };
    const cfg = config[status] || config.pending;
    return <Tag color={cfg.color}>{cfg.text}</Tag>;
  };

  const getDaysRemainingDisplay = (days: number, type: string) => {
    if (type === "expired") {
      return <span style={{ color: '#DC2626', fontWeight: 600 }}>已过期 {Math.abs(days)} 天</span>;
    }
    if (days <= 1) {
      return <span style={{ color: '#DC2626', fontWeight: 600 }}>剩 {days} 天</span>;
    }
    if (days <= 3) {
      return <span style={{ color: '#EA580C', fontWeight: 600 }}>剩 {days} 天</span>;
    }
    return <span style={{ color: '#D97706' }}>剩 {days} 天</span>;
  };

  const getCategoryTag = (category: string) => {
    const config: Record<string, { color: string; text: string }> = {
      food: { color: "orange", text: "食品" },
      drink: { color: "blue", text: "饮料" },
      daily: { color: "green", text: "日用品" },
    };
    const cfg = config[category] || { color: "default", text: category };
    return <Tag color={cfg.color}>{cfg.text}</Tag>;
  };

  const columns: ColumnsType<ExpiryAlert> = [
    {
      title: "提醒类型",
      key: "alert_type",
      width: 120,
      render: (_: any, record: ExpiryAlert) => getAlertTypeTag(record.alert_type, record.days_remaining),
    },
    {
      title: "物资信息",
      key: "item_info",
      render: (_: any, record: ExpiryAlert) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
            {record.item_name}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            <Space>
              {getCategoryTag(record.category)}
              <span>数量: {record.quantity}</span>
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: "柜机位置",
      key: "location",
      render: (_: any, record: ExpiryAlert) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
            <Store size={14} />
            <span>{record.cabinet_code}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <MapPin size={12} />
            {record.cabinet_location}
          </div>
        </div>
      ),
    },
    {
      title: "到期时间",
      key: "expiry",
      width: 150,
      render: (_: any, record: ExpiryAlert) => (
        <div>
          <div style={{ color: '#1E293B' }}>
            {new Date(record.expiry_date).toLocaleDateString('zh-CN')}
          </div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            {getDaysRemainingDisplay(record.days_remaining, record.alert_type)}
          </div>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "alert_status",
      key: "alert_status",
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: ExpiryAlert) => (
        <Space>
          {record.alert_status === "pending" && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<Bell size={14} />}
                onClick={() => handleNotify(record)}
              >
                提醒取走
              </Button>
              <Button 
                danger 
                size="small" 
                onClick={() => handleRemove(record)}
              >
                下架
              </Button>
            </>
          )}
          {record.alert_status === "notified" && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckCircle2 size={14} />}
                onClick={() => handleProcess(record)}
              >
                确认处理
              </Button>
              <Button 
                danger 
                size="small" 
                onClick={() => handleRemove(record)}
              >
                下架
              </Button>
            </>
          )}
          {(record.alert_status === "processed" || record.alert_status === "removed") && (
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>
              处理时间: {record.processed_at ? new Date(record.processed_at).toLocaleDateString('zh-CN') : '-'}
            </span>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: `全部 (${stats.total})` },
    { key: "pending", label: <Badge count={stats.pending} size="small" offset={[8, 0]}>待处理</Badge> },
    { key: "notified", label: `已提醒 (${stats.notified})` },
    { key: "processed", label: `已处理 (${stats.processed})` },
    { key: "critical", label: <span style={{ color: '#DC2626' }}>紧急 ({stats.critical})</span> },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        临期物资管理
      </h2>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #DC2626' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>紧急临期</span>}
              value={stats.critical}
              valueStyle={{ color: '#DC2626', fontWeight: 700 }}
              prefix={<AlertTriangle size={20} style={{ marginRight: '8px' }} />}
            />
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
              需要立即处理
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>待处理</span>}
              value={stats.pending}
              valueStyle={{ color: '#D97706', fontWeight: 700 }}
              prefix={<Clock size={20} style={{ marginRight: '8px' }} />}
            />
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
              等待提醒或下架
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>已提醒</span>}
              value={stats.notified}
              valueStyle={{ color: '#2563EB', fontWeight: 700 }}
              prefix={<Bell size={20} style={{ marginRight: '8px' }} />}
            />
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
              等待确认处理
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>已处理</span>}
              value={stats.processed}
              valueStyle={{ color: '#059669', fontWeight: 700 }}
              prefix={<CheckCircle2 size={20} style={{ marginRight: '8px' }} />}
            />
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
              本月处理完成
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px', background: '#FEF3C7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={24} color="#D97706" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#92400E', marginBottom: '4px' }}>
              临期物资处理流程
            </div>
            <div style={{ fontSize: '14px', color: '#A16207' }}>
              1. 发现临期物资 → 2. 点击"提醒取走"通知管理人员 → 3. 前往柜机取走物资 → 4. 点击"确认处理"完成
            </div>
          </div>
          <ArrowRight size={20} color="#D97706" />
        </div>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: '12px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: '16px' }}
        />
        <Table
          columns={columns}
          dataSource={tabFilteredAlerts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
      </Card>
    </div>
  );
};
