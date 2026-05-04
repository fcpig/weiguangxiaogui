import { Row, Col, Card, Table, Tag, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import { 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Clock,
  CheckCircle2,
  BarChart3
} from "lucide-react";

interface CategoryStats {
  food: number;
  drink: number;
  daily: number;
  total: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  total: number;
  remaining: number;
  claimed: number;
  claimRate: number;
  status: "normal" | "low" | "critical";
}

// Demo stats
const stats: CategoryStats = {
  food: 12,
  drink: 8,
  daily: 4,
  total: 24,
};

// Demo inventory data
const inventoryData: InventoryItem[] = [
  { id: "1", name: "有机大米 5kg", category: "food", total: 20, remaining: 8, claimed: 12, claimRate: 60, status: "normal" },
  { id: "2", name: "纯牛奶 250ml*12", category: "drink", total: 24, remaining: 12, claimed: 12, claimRate: 50, status: "normal" },
  { id: "3", name: "全麦面包", category: "food", total: 15, remaining: 5, claimed: 10, claimRate: 67, status: "low" },
  { id: "4", name: "矿泉水 550ml*24", category: "drink", total: 30, remaining: 20, claimed: 10, claimRate: 33, status: "normal" },
  { id: "5", name: "方便面 5连包", category: "food", total: 25, remaining: 15, claimed: 10, claimRate: 40, status: "normal" },
  { id: "6", name: "食用油 5L", category: "food", total: 12, remaining: 6, claimed: 6, claimRate: 50, status: "normal" },
  { id: "7", name: "洗洁精 500ml", category: "daily", total: 20, remaining: 10, claimed: 10, claimRate: 50, status: "normal" },
  { id: "8", name: "酸奶 180ml*4", category: "drink", total: 30, remaining: 15, claimed: 15, claimRate: 50, status: "normal" },
  { id: "9", name: "八宝粥 360g*6", category: "food", total: 24, remaining: 18, claimed: 6, claimRate: 25, status: "normal" },
  { id: "10", name: "饼干礼盒", category: "food", total: 15, remaining: 10, claimed: 5, claimRate: 33, status: "normal" },
];

// Weekly claim trend data
const weeklyData = [
  { week: "第1周", claimed: 45, newItems: 12 },
  { week: "第2周", claimed: 52, newItems: 15 },
  { week: "第3周", claimed: 48, newItems: 10 },
  { week: "第4周", claimed: 61, newItems: 18 },
];

export const EnterpriseAnalytics = () => {
  const columns: ColumnsType<InventoryItem> = [
    {
      title: "物资名称",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: "类别",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        const config: Record<string, { color: string; text: string }> = {
          food: { color: "orange", text: "食品" },
          drink: { color: "blue", text: "饮料" },
          daily: { color: "green", text: "日用品" },
        };
        const cfg = config[category];
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: "投放总量",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
    {
      title: "已领取",
      dataIndex: "claimed",
      key: "claimed",
      align: "center",
      render: (claimed: number) => (
        <span style={{ color: '#059669', fontWeight: 500 }}>{claimed}</span>
      ),
    },
    {
      title: "剩余库存",
      dataIndex: "remaining",
      key: "remaining",
      align: "center",
      render: (remaining: number, record: InventoryItem) => {
        const percent = Math.round((remaining / record.total) * 100);
        let color = "#10B981";
        if (percent < 30) color = "#DC2626";
        else if (percent < 50) color = "#D97706";
        return <span style={{ color, fontWeight: 500 }}>{remaining}</span>;
      },
    },
    {
      title: "领取率",
      dataIndex: "claimRate",
      key: "claimRate",
      render: (rate: number) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate >= 60 ? "#10B981" : rate >= 40 ? "#D97706" : "#3B82F6"}
          format={(percent) => <span style={{ fontSize: '12px' }}>{percent}%</span>}
        />
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          normal: { color: "success", text: "正常", icon: <CheckCircle2 size={14} /> },
          low: { color: "warning", text: "库存偏低", icon: <AlertTriangle size={14} /> },
          critical: { color: "error", text: "库存告急", icon: <AlertTriangle size={14} /> },
        };
        const cfg = config[status];
        return (
          <Tag color={cfg.color} icon={cfg.icon}>
            {cfg.text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        物资统计
      </h2>

      {/* Category Stats */}
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #D97706',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>食品类</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#D97706' }}>{stats.food}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>占比 50%</p>
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
                  background: '#FFFBEB',
                }}
              >
                🍎
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #2563EB',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>饮料类</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#2563EB' }}>{stats.drink}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>占比 33%</p>
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
                🥤
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
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>日用品类</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#059669' }}>{stats.daily}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>占比 17%</p>
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
                🧴
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              borderLeft: '4px solid #7C3AED',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>总库存</p>
                <p style={{ fontSize: '36px', fontWeight: 700, margin: 0, color: '#7C3AED' }}>{stats.total}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>物资种类</p>
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
                  background: '#F5F3FF',
                }}
              >
                📦
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Weekly Trend */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#1E40AF" />
                <span style={{ fontWeight: 600, fontSize: '16px' }}>领取趋势</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            <div style={{ padding: '16px 0' }}>
              {weeklyData.map((week, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>{week.week}</span>
                    <span style={{ fontSize: '14px', color: '#1E40AF', fontWeight: 600 }}>{week.claimed} 件</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(week.claimed / 70) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <Tag color="blue" style={{ fontSize: '12px' }}>+{week.newItems} 新投放</Tag>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px', background: '#F8FAFC', borderRadius: '8px', marginTop: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1E40AF' }}>206</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>本月领取总数</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>55</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>本月新投放</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#D97706' }}>78.9%</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>平均领取率</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="#D97706" />
                <span style={{ fontWeight: 600, fontSize: '16px' }}>库存预警</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            <div style={{ padding: '16px 0' }}>
              {inventoryData.filter(item => item.status !== "normal").length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: '#ECFDF5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={40} color="#10B981" />
                  </div>
                  <p style={{ color: '#059669', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                    库存状态良好
                  </p>
                  <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                    所有物资库存充足，无需预警
                  </p>
                </div>
              ) : (
                inventoryData
                  .filter(item => item.status !== "normal")
                  .map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '12px', 
                      background: '#FEF3C7', 
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <AlertTriangle size={20} color="#D97706" style={{ marginRight: '12px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#1E293B' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          剩余 {item.remaining} / {item.total} ({Math.round((item.remaining / item.total) * 100)}%)
                        </div>
                      </div>
                      <Tag color="warning">库存偏低</Tag>
                    </div>
                  ))
              )}
            </div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>
                  <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  临期物资预警
                </span>
                <Tag color="error">3 项紧急</Tag>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Tag color="error">有机大米 5kg</Tag>
                <Tag color="warning">全麦面包</Tag>
                <Tag color="warning">纯牛奶</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Inventory Detail Table */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="#1E40AF" />
                <span style={{ fontWeight: 600, fontSize: '16px' }}>物资明细</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            <Table
              columns={columns}
              dataSource={inventoryData}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
