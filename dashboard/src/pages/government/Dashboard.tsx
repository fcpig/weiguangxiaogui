import { Row, Col, Card, Button, Badge } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigation } from "@refinedev/core";
import { 
  AlertTriangle, 
  Building2, 
  Package, 
  Clock,
  ArrowRight,
  CheckCircle2,
  Bell
} from "lucide-react";
import { useMemo } from "react";

const weeklyData = [
  { name: "周一", claims: 24 },
  { name: "周二", claims: 18 },
  { name: "周三", claims: 32 },
  { name: "周四", claims: 28 },
  { name: "周五", claims: 45 },
  { name: "周六", claims: 38 },
  { name: "周日", claims: 52 },
];

const expiryData = [
  { name: "已领取", value: 342, color: "#1E40AF" },
  { name: "已过期", value: 28, color: "#DC2626" },
  { name: "待领取", value: 86, color: "#059669" },
];

// Demo data for expiry alerts by merchant
const merchantExpiryStats = [
  { name: "爱心便利店", total: 4, critical: 2, pending: 2 },
  { name: "健康食品超市", total: 2, critical: 1, pending: 2 },
  { name: "肯德基（扬名店）", total: 2, critical: 2, pending: 1 },
  { name: "麦当劳（社区店）", total: 1, critical: 0, pending: 1 },
  { name: "华润万家超市", total: 2, critical: 0, pending: 1 },
  { name: "永和大王", total: 2, critical: 1, pending: 0 },
];

export const GovernmentDashboard = () => {
  const { list } = useNavigation();

  // Calculate total stats
  const stats = useMemo(() => {
    return {
      totalAlerts: merchantExpiryStats.reduce((sum, m) => sum + m.total, 0),
      criticalAlerts: merchantExpiryStats.reduce((sum, m) => sum + m.critical, 0),
      pendingAlerts: merchantExpiryStats.reduce((sum, m) => sum + m.pending, 0),
      totalMerchants: merchantExpiryStats.length,
    };
  }, []);

  // Get merchants with critical alerts
  const criticalMerchants = useMemo(() => {
    return merchantExpiryStats
      .filter(m => m.critical > 0)
      .sort((a, b) => b.critical - a.critical)
      .slice(0, 3);
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        政府管理控制台
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
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>柜机总数</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#1E40AF' }}>2</p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>在线 2 台</p>
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
                🗄️
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
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>爱心商户</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#059669' }}>6</p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>活跃商户 6 家</p>
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
                🏪
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: stats.criticalAlerts > 0 ? '4px solid #DC2626' : '4px solid #10B981',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>紧急临期</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: stats.criticalAlerts > 0 ? '#DC2626' : '#059669' }}>
                  {stats.criticalAlerts}
                </p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>需立即处理</p>
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
                  background: stats.criticalAlerts > 0 ? '#FEF2F2' : '#ECFDF5',
                }}
              >
                <AlertTriangle size={24} color={stats.criticalAlerts > 0 ? '#DC2626' : '#059669'} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: stats.pendingAlerts > 0 ? '4px solid #D97706' : '4px solid #10B981',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>待处理临期</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: stats.pendingAlerts > 0 ? '#D97706' : '#059669' }}>
                  {stats.pendingAlerts}
                </p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>等待商户处理</p>
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
                  background: stats.pendingAlerts > 0 ? '#FEF3C7' : '#ECFDF5',
                }}
              >
                <Clock size={24} color={stats.pendingAlerts > 0 ? '#D97706' : '#059669'} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={16}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: '16px' }}>近七日领取量</span>}
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: '20px' } }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [`${value} 次`, '领取次数']}
                />
                <Bar dataKey="claims" fill="#1E40AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: '16px' }}>食物领取与过期占比</span>}
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: '20px' } }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expiryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  labelLine={false}
                >
                  {expiryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} 件`, '']}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: '#64748B', fontSize: '12px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
