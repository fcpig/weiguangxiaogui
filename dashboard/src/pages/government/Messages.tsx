import { Table, Tag, Space, Button, Modal, message, Card, Row, Col, Statistic, Tabs, Badge, Select, Progress, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useUpdate } from "@refinedev/core";
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
  ArrowRight,
  Building2,
  TrendingUp,
  Users
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

// Demo data for government - includes all merchants
const demoExpiryAlerts: ExpiryAlert[] = [
  // 爱心便利店 (M001)
  {
    id: "1",
    item_id: "ITEM-2024-001",
    item_name: "有机大米 5kg",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-26",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 2,
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
  {
    id: "3",
    item_id: "ITEM-2024-003",
    item_name: "全麦面包",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M001",
    merchant_name: "爱心便利店",
    expiry_date: "2026-04-24",
    alert_status: "processed",
    alert_type: "expired",
    days_remaining: 0,
    quantity: 5,
    category: "food",
    created_at: "2026-04-18T10:00:00",
    notified_at: "2026-04-22T14:00:00",
    processed_at: "2026-04-23T16:30:00",
  },
  // 健康食品超市 (M002)
  {
    id: "4",
    item_id: "ITEM-2024-004",
    item_name: "矿泉水 550ml*24",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M002",
    merchant_name: "健康食品超市",
    expiry_date: "2026-04-25",
    alert_status: "pending",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 20,
    category: "drink",
    created_at: "2026-04-21T11:20:00",
  },
  {
    id: "5",
    item_id: "ITEM-2024-005",
    item_name: "有机燕麦片",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M002",
    merchant_name: "健康食品超市",
    expiry_date: "2026-04-27",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 3,
    quantity: 15,
    category: "food",
    created_at: "2026-04-22T14:45:00",
  },
  // 肯德基（扬名店）(M003)
  {
    id: "6",
    item_id: "ITEM-2024-006",
    item_name: "汉堡包",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M003",
    merchant_name: "肯德基（扬名店）",
    expiry_date: "2026-04-24",
    alert_status: "notified",
    alert_type: "expired",
    days_remaining: 0,
    quantity: 8,
    category: "food",
    created_at: "2026-04-23T16:30:00",
    notified_at: "2026-04-23T18:00:00",
  },
  {
    id: "7",
    item_id: "ITEM-2024-007",
    item_name: "鸡翅",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M003",
    merchant_name: "肯德基（扬名店）",
    expiry_date: "2026-04-25",
    alert_status: "pending",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 12,
    category: "food",
    created_at: "2026-04-23T17:00:00",
  },
  // 麦当劳（社区店）(M004)
  {
    id: "8",
    item_id: "ITEM-2024-008",
    item_name: "麦辣鸡腿堡",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M004",
    merchant_name: "麦当劳（社区店）",
    expiry_date: "2026-04-26",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 2,
    quantity: 10,
    category: "food",
    created_at: "2026-04-22T12:00:00",
  },
  // 华润万家超市 (M005)
  {
    id: "9",
    item_id: "ITEM-2024-009",
    item_name: "方便面 5连包",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M005",
    merchant_name: "华润万家超市",
    expiry_date: "2026-05-10",
    alert_status: "pending",
    alert_type: "expiring_soon",
    days_remaining: 16,
    quantity: 30,
    category: "food",
    created_at: "2026-04-20T09:00:00",
  },
  {
    id: "10",
    item_id: "ITEM-2024-010",
    item_name: "洗洁精 500ml",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M005",
    merchant_name: "华润万家超市",
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
  // 永和大王 (M006)
  {
    id: "11",
    item_id: "ITEM-2024-011",
    item_name: "豆浆",
    cabinet_code: "YM-002",
    cabinet_location: "扬名街道文化广场",
    merchant_id: "M006",
    merchant_name: "永和大王",
    expiry_date: "2026-04-24",
    alert_status: "processed",
    alert_type: "expired",
    days_remaining: 0,
    quantity: 20,
    category: "drink",
    created_at: "2026-04-23T06:00:00",
    notified_at: "2026-04-23T12:00:00",
    processed_at: "2026-04-23T15:00:00",
  },
  {
    id: "12",
    item_id: "ITEM-2024-012",
    item_name: "油条",
    cabinet_code: "YM-001",
    cabinet_location: "扬名街道社区中心",
    merchant_id: "M006",
    merchant_name: "永和大王",
    expiry_date: "2026-04-25",
    alert_status: "notified",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 15,
    category: "food",
    created_at: "2026-04-23T07:00:00",
    notified_at: "2026-04-23T14:00:00",
  },
];

const merchants = [
  { value: "all", label: "全部商户" },
  { value: "M001", label: "爱心便利店" },
  { value: "M002", label: "健康食品超市" },
  { value: "M003", label: "肯德基（扬名店）" },
  { value: "M004", label: "麦当劳（社区店）" },
  { value: "M005", label: "华润万家超市" },
  { value: "M006", label: "永和大王" },
];

export const Messages = () => {
  const { mutate: updateMutate } = useUpdate();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [alerts, setAlerts] = useState<ExpiryAlert[]>(demoExpiryAlerts);

  // Filter alerts by merchant
  const merchantFilteredAlerts = useMemo(() => {
    if (selectedMerchant === "all") return alerts;
    return alerts.filter(alert => alert.merchant_id === selectedMerchant);
  }, [alerts, selectedMerchant]);

  // Statistics
  const stats = useMemo(() => {
    const data = merchantFilteredAlerts;
    const totalMerchants = new Set(data.map(a => a.merchant_id)).size;
    return {
      total: data.length,
      totalMerchants,
      pending: data.filter(a => a.alert_status === "pending").length,
      notified: data.filter(a => a.alert_status === "notified").length,
      processed: data.filter(a => a.alert_status === "processed" || a.alert_status === "removed").length,
      critical: data.filter(a => a.alert_type === "critical" || a.alert_type === "expired").length,
      totalQuantity: data.reduce((sum, a) => sum + a.quantity, 0),
    };
  }, [merchantFilteredAlerts]);

  // Tab filtered data
  const tabFilteredAlerts = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return merchantFilteredAlerts.filter(a => a.alert_status === "pending");
      case "notified":
        return merchantFilteredAlerts.filter(a => a.alert_status === "notified");
      case "processed":
        return merchantFilteredAlerts.filter(a => a.alert_status === "processed" || a.alert_status === "removed");
      case "critical":
        return merchantFilteredAlerts.filter(a => a.alert_type === "critical" || a.alert_type === "expired");
      default:
        return merchantFilteredAlerts;
    }
  }, [merchantFilteredAlerts, activeTab]);

  // Merchant statistics
  const merchantStats = useMemo(() => {
    const stats: Record<string, { name: string; total: number; pending: number; critical: number }> = {};
    alerts.forEach(alert => {
      if (!stats[alert.merchant_id]) {
        stats[alert.merchant_id] = { name: alert.merchant_name, total: 0, pending: 0, critical: 0 };
      }
      stats[alert.merchant_id].total++;
      if (alert.alert_status === "pending") stats[alert.merchant_id].pending++;
      if (alert.alert_type === "critical" || alert.alert_type === "expired") stats[alert.merchant_id].critical++;
    });
    return Object.values(stats).sort((a, b) => b.critical - a.critical);
  }, [alerts]);

  const handleNotifyMerchant = (record: ExpiryAlert) => {
    Modal.confirm({
      title: "通知商户",
      content: `确定要通知商户「${record.merchant_name}」处理临期物资吗？\n\n物资：${record.item_name}\n柜机：${record.cabinet_code}\n位置：${record.cabinet_location}`,
      okText: "确认通知",
      cancelText: "取消",
      onOk: () => {
        setAlerts(prev =>
          prev.map(alert =>
            alert.id === record.id 
              ? { ...alert, alert_status: "notified", notified_at: new Date().toISOString() } 
              : alert
          )
        );
        message.success(`已通知商户「${record.merchant_name}」，请尽快处理临期物资`);
      },
    });
  };

  const handleBatchNotify = () => {
    const pendingAlerts = merchantFilteredAlerts.filter(a => a.alert_status === "pending");
    if (pendingAlerts.length === 0) {
      message.info("没有待处理的临期物资");
      return;
    }
    
    Modal.confirm({
      title: "批量通知",
      content: `确定要批量通知所有待处理的临期物资吗？\n共 ${pendingAlerts.length} 条记录`,
      okText: "确认批量通知",
      cancelText: "取消",
      onOk: () => {
        setAlerts(prev =>
          prev.map(alert =>
            alert.alert_status === "pending" && (selectedMerchant === "all" || alert.merchant_id === selectedMerchant)
              ? { ...alert, alert_status: "notified", notified_at: new Date().toISOString() } 
              : alert
          )
        );
        message.success(`已批量通知 ${pendingAlerts.length} 条临期物资记录`);
      },
    });
  };

  const handleProcess = (record: ExpiryAlert) => {
    Modal.confirm({
      title: "确认处理",
      content: `确定该临期物资已由商户处理完成吗？\n\n商户：${record.merchant_name}\n物资：${record.item_name}`,
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
      notified: { color: "blue", text: "已通知" },
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
      title: "商户信息",
      key: "merchant_info",
      width: 150,
      render: (_: any, record: ExpiryAlert) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
            <Building2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {record.merchant_name}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            ID: {record.merchant_id}
          </div>
        </div>
      ),
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
            <Button 
              type="primary" 
              size="small" 
              icon={<Bell size={14} />}
              onClick={() => handleNotifyMerchant(record)}
            >
              通知商户
            </Button>
          )}
          {record.alert_status === "notified" && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CheckCircle2 size={14} />}
              onClick={() => handleProcess(record)}
            >
              确认处理
            </Button>
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
    { key: "notified", label: `已通知 (${stats.notified})` },
    { key: "processed", label: `已处理 (${stats.processed})` },
    { key: "critical", label: <span style={{ color: '#DC2626' }}>紧急 ({stats.critical})</span> },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        全辖区临期物资监管
      </h2>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #DC2626' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>紧急临期</span>}
              value={stats.critical}
              valueStyle={{ color: '#DC2626', fontWeight: 700 }}
              prefix={<AlertTriangle size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>待处理</span>}
              value={stats.pending}
              valueStyle={{ color: '#D97706', fontWeight: 700 }}
              prefix={<Clock size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>已通知</span>}
              value={stats.notified}
              valueStyle={{ color: '#2563EB', fontWeight: 700 }}
              prefix={<Bell size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>已处理</span>}
              value={stats.processed}
              valueStyle={{ color: '#059669', fontWeight: 700 }}
              prefix={<CheckCircle2 size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #8B5CF6' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>涉及商户</span>}
              value={stats.totalMerchants}
              valueStyle={{ color: '#7C3AED', fontWeight: 700 }}
              prefix={<Building2 size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: '12px', borderLeft: '4px solid #06B6D4' }}>
            <Statistic
              title={<span style={{ color: '#64748B' }}>物资总数</span>}
              value={stats.totalQuantity}
              valueStyle={{ color: '#0891B2', fontWeight: 700 }}
              prefix={<Package size={20} style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Merchant Stats Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} />
          各商户临期物资统计
        </div>
        <Row gutter={[16, 16]}>
          {merchantStats.map((merchant, index) => (
            <Col span={8} key={index}>
              <div style={{ 
                padding: '12px 16px', 
                background: '#F8FAFC', 
                borderRadius: '8px',
                borderLeft: merchant.critical > 0 ? '3px solid #DC2626' : '3px solid #10B981'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{merchant.name}</span>
                  {merchant.critical > 0 && (
                    <Badge count={merchant.critical} style={{ backgroundColor: '#DC2626' }} />
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  总计: {merchant.total} | 待处理: {merchant.pending} | 紧急: {merchant.critical}
                </div>
                <Progress 
                  percent={Math.round((merchant.pending / merchant.total) * 100)} 
                  size="small" 
                  strokeColor={merchant.critical > 0 ? '#DC2626' : '#10B981'}
                  showInfo={false}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Filter and Actions */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 600, color: '#1E293B' }}>筛选商户:</span>
            <Select
              value={selectedMerchant}
              onChange={setSelectedMerchant}
              options={merchants}
              style={{ width: 200 }}
              placeholder="选择商户"
            />
          </div>
          <Button 
            type="primary" 
            icon={<Bell size={16} />}
            onClick={handleBatchNotify}
            disabled={stats.pending === 0}
          >
            批量通知待处理 ({stats.pending})
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px', background: '#FEF3C7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertTriangle size={24} color="#D97706" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#92400E', marginBottom: '4px' }}>
              政府监管临期物资处理流程
            </div>
            <div style={{ fontSize: '14px', color: '#A16207' }}>
              1. 监控全辖区临期物资 → 2. 点击"通知商户"提醒处理 → 3. 跟踪处理进度 → 4. 确认处理完成
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
