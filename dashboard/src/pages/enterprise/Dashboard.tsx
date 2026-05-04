import { Row, Col, Card, Button, Badge, List, Tag } from "antd";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import { 
  AlertTriangle, 
  Clock, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Calendar,
  Store,
  Bell,
  CheckCircle2
} from "lucide-react";
import { useMemo } from "react";

interface ExpiryAlert {
  id: string;
  item_name: string;
  cabinet_code: string;
  expiry_date: string;
  alert_type: "expiring_soon" | "expired" | "critical";
  days_remaining: number;
  quantity: number;
}

// Demo expiry alerts for dashboard
const demoExpiryAlerts: ExpiryAlert[] = [
  {
    id: "1",
    item_name: "有机大米 5kg",
    cabinet_code: "YM-001",
    expiry_date: "2026-04-25",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 8,
  },
  {
    id: "2",
    item_name: "纯牛奶 250ml*12",
    cabinet_code: "YM-001",
    expiry_date: "2026-04-25",
    alert_type: "critical",
    days_remaining: 1,
    quantity: 12,
  },
  {
    id: "3",
    item_name: "全麦面包",
    cabinet_code: "YM-002",
    expiry_date: "2026-04-23",
    alert_type: "expired",
    days_remaining: -1,
    quantity: 5,
  },
  {
    id: "4",
    item_name: "酸奶 180ml*4",
    cabinet_code: "YM-003",
    expiry_date: "2026-04-22",
    alert_type: "expired",
    days_remaining: -2,
    quantity: 15,
  },
  {
    id: "5",
    item_name: "矿泉水 550ml*24",
    cabinet_code: "YM-001",
    expiry_date: "2026-04-26",
    alert_type: "expiring_soon",
    days_remaining: 2,
    quantity: 20,
  },
  {
    id: "6",
    item_name: "八宝粥 360g*6",
    cabinet_code: "YM-002",
    expiry_date: "2026-04-27",
    alert_type: "expiring_soon",
    days_remaining: 3,
    quantity: 18,
  },
  {
    id: "7",
    item_name: "方便面 5连包",
    cabinet_code: "YM-002",
    expiry_date: "2026-04-28",
    alert_type: "expiring_soon",
    days_remaining: 4,
    quantity: 15,
  },
  {
    id: "8",
    item_name: "蛋糕卷 500g",
    cabinet_code: "YM-001",
    expiry_date: "2026-04-20",
    alert_type: "expired",
    days_remaining: -4,
    quantity: 6,
  },
];

interface MerchantStats {
  itemCount: number;
  claimCount: number;
  alertCount: number;
  expiringSoon: number;
  expired: number;
}

export const EnterpriseDashboard = () => {
  const { data: identity } = useGetIdentity<{ merchantId?: string }>();
  const { list } = useNavigation();

  // Calculate stats from demo data
  const stats: MerchantStats = useMemo(() => {
    const criticalCount = demoExpiryAlerts.filter(a => a.alert_type === "critical" || a.alert_type === "expired").length;
    const expiringSoon = demoExpiryAlerts.filter(a => a.alert_type === "expiring_soon" && a.days_remaining <= 3).length;
    const expired = demoExpiryAlerts.filter(a => a.alert_type === "expired").length;
    
    return {
      itemCount: 24,
      claimCount: 156,
      alertCount: demoExpiryAlerts.length,
      expiringSoon,
      expired,
    };
  }, []);

  // Get urgent alerts (critical + expired)
  const urgentAlerts = useMemo(() => {
    return demoExpiryAlerts
      .filter(a => a.alert_type === "critical" || a.alert_type === "expired")
      .slice(0, 3);
  }, []);

  const getAlertTag = (type: string, days: number) => {
    if (type === "expired") {
      return <Tag color="#DC2626" style={{ borderRadius: '4px' }}>已过期</Tag>;
    }
    if (days <= 1) {
      return <Tag color="#DC2626" style={{ borderRadius: '4px' }}>剩 {days} 天</Tag>;
    }
    if (days <= 3) {
      return <Tag color="#EA580C" style={{ borderRadius: '4px' }}>剩 {days} 天</Tag>;
    }
    return <Tag color="#D97706" style={{ borderRadius: '4px' }}>剩 {days} 天</Tag>;
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        商户控制台
      </h2>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #1E40AF',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>我的物资数</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#1E40AF' }}>{stats.itemCount}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>当前投放物资</p>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  background: '#EFF6FF',
                }}
              >
                <Package size={24} color="#1E40AF" />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #059669',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>总捐赠次数</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#059669' }}>{stats.claimCount}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>历史捐赠总计</p>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  background: '#ECFDF5',
                }}
              >
                <TrendingUp size={24} color="#059669" />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: stats.expiringSoon > 0 ? '4px solid #D97706' : '4px solid #10B981',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>临期物资</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: stats.expiringSoon > 0 ? '#D97706' : '#059669' }}>
                  {stats.expiringSoon}
                </p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>3天内到期</p>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  background: stats.expiringSoon > 0 ? '#FEF3C7' : '#ECFDF5',
                }}
              >
                <Clock size={24} color={stats.expiringSoon > 0 ? '#D97706' : '#059669'} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: stats.expired > 0 ? '4px solid #DC2626' : '4px solid #10B981',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>已过期物资</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: stats.expired > 0 ? '#DC2626' : '#059669' }}>
                  {stats.expired}
                </p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>需立即处理</p>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  background: stats.expired > 0 ? '#FEF2F2' : '#ECFDF5',
                }}
              >
                <AlertTriangle size={24} color={stats.expired > 0 ? '#DC2626' : '#059669'} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity & Quick Actions */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: '16px' }}>📋 临期物资预警</span>}
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: '0' } }}
          >
            <List
              dataSource={urgentAlerts}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: item.alert_type === 'expired' ? '#FEF2F2' : '#FFF7ED',
                      }}
                    >
                      {item.alert_type === 'expired' ? (
                        <AlertTriangle size={20} color="#DC2626" />
                      ) : (
                        <Clock size={20} color="#EA580C" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>{item.item_name}</span>
                        {getAlertTag(item.alert_type, item.days_remaining)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        柜机: {item.cabinet_code} · 数量: {item.quantity}
                      </div>
                    </div>
                    <ArrowRight size={16} color="#94A3B8" />
                  </div>
                </List.Item>
              )}
            />
            {urgentAlerts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '12px' }} />
                <p style={{ color: '#64748B', margin: 0 }}>暂无紧急预警</p>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: '16px' }}>🚀 快捷操作</span>}
            style={{ borderRadius: '12px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Button
                type="default"
                size="large"
                icon={<Package size={18} />}
                style={{
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
                onClick={() => list('devices')}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>物资管理</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>查看所有物资</span>
              </Button>
              <Button
                type="default"
                size="large"
                icon={<Store size={18} />}
                style={{
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
                onClick={() => list('reports')}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>投放记录</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>查看历史投放</span>
              </Button>
              <Button
                type="default"
                size="large"
                icon={<Bell size={18} />}
                style={{
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
                onClick={() => list('messages')}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>预警通知</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>临期物资提醒</span>
              </Button>
              <Button
                type="default"
                size="large"
                icon={<TrendingUp size={18} />}
                style={{
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
                onClick={() => list('analytics')}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>数据统计</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>查看统计报表</span>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Monthly Stats */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: '16px' }}>📈 本月投放概览</span>}
            style={{ borderRadius: '12px' }}
          >
            <Row gutter={[48, 24]}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>128</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>本月投放次数</div>
                  <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>↑ 12% 较上月</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>486</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>本月投放数量</div>
                  <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>↑ 8% 较上月</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#D97706', marginBottom: '8px' }}>3</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>覆盖柜机数</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>稳定运营中</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#7C3AED', marginBottom: '8px' }}>98.5%</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>物资领取率</div>
                  <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>↑ 2.3% 较上月</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
