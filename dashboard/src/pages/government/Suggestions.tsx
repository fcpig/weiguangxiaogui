import { Row, Col, Card } from "antd";
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
  AreaChart,
  Area,
} from "recharts";

const areaPickupData = [
  { area: "梁溪区", pickups: 342, rank: 1 },
  { area: "锡山区", pickups: 286, rank: 2 },
  { area: "惠山区", pickups: 198, rank: 3 },
  { area: "滨湖区", pickups: 156, rank: 4 },
  { area: "新吴区", pickups: 124, rank: 5 },
  { area: "经开区", pickups: 89, rank: 6 },
];

const areaDisabledData = [
  { area: "梁溪区", count: 45, percentage: 28 },
  { area: "锡山区", count: 32, percentage: 20 },
  { area: "惠山区", count: 28, percentage: 17 },
  { area: "滨湖区", count: 24, percentage: 15 },
  { area: "新吴区", count: 21, percentage: 13 },
  { area: "经开区", count: 12, percentage: 7 },
];

const merchantProductData = [
  { name: "华润超市", items: 486, color: "#1E40AF" },
  { name: "大润发", items: 352, color: "#3B82F6" },
  { name: "永辉超市", items: 298, color: "#60A5FA" },
  { name: "麦德龙", items: 186, color: "#93C5FD" },
  { name: "其他", items: 124, color: "#BFDBFE" },
];

const wasteRateData = [
  { name: "周一", rate: 6.2 },
  { name: "周二", rate: 5.8 },
  { name: "周三", rate: 7.1 },
  { name: "周四", rate: 4.9 },
  { name: "周五", rate: 5.5 },
  { name: "周六", rate: 3.2 },
  { name: "周日", rate: 2.8 },
];

const dailyTrendData = [
  { date: "4/20", pickups: 89, target: 80 },
  { date: "4/21", pickups: 102, target: 85 },
  { date: "4/22", pickups: 78, target: 80 },
  { date: "4/23", pickups: 95, target: 85 },
  { date: "4/24", pickups: 112, target: 90 },
  { date: "4/25", pickups: 128, target: 95 },
  { date: "4/26", pickups: 98, target: 90 },
];

export const Suggestions = () => {
  return (
    <div className="animate-in">
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        优化建议
      </h2>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>本周总体概况（4月20日-26日）</h3>
            </div>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, lineHeight: 1.6 }}>
              本周全区域共完成领取 <strong style={{ fontSize: '20px' }}>1,195</strong> 人次，
              较上周增长 <strong style={{ color: '#86EFAC' }}>12.3%</strong>。
              平均每日领取 <strong style={{ fontSize: '20px' }}>171</strong> 人次，
              总体浪费率控制在 <strong style={{ fontSize: '20px' }}>5.0%</strong> 以内，
              整体运营状况良好。
            </p>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>各区域领取人数分布</span>
              </div>
            }
            style={{ borderRadius: '12px', height: '100%' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '8px 16px',
                  background: '#DCFCE7',
                  borderRadius: '8px',
                  borderLeft: '3px solid #22C55E'
                }}>
                  <div style={{ fontSize: '12px', color: '#166534' }}>领取最多</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#166534' }}>梁溪区 · 342人次</div>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: '#FEF3C7',
                  borderRadius: '8px',
                  borderLeft: '3px solid #F59E0B'
                }}>
                  <div style={{ fontSize: '12px', color: '#92400E' }}>领取较少</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#92400E' }}>经开区 · 89人次</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={areaPickupData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis type="category" dataKey="area" stroke="#64748B" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [`${value} 人次`, '领取数']}
                />
                <Bar dataKey="pickups" radius={[0, 4, 4, 0]}>
                  {areaPickupData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22C55E' : index === 5 ? '#F59E0B' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>♿</span>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>困难群体分布</span>
              </div>
            }
            style={{ borderRadius: '12px', height: '100%' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{
              background: '#FEF3C7',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              borderLeft: '3px solid #F59E0B'
            }}>
              <div style={{ fontSize: '13px', color: '#92400E' }}>
                梁溪区困难群体最为集中，<br />
                占总数的 <strong>28%</strong>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={areaDisabledData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {areaDisabledData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.area === '梁溪区' ? '#F59E0B' : entry.area === '锡山区' ? '#FCD34D' : '#FDE68A'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, _name: any, props: any) => [`${value} 人`, props.payload.area]}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: '12px', color: '#64748B', textAlign: 'center' }}>
              共计 162 位困难群众
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🏪</span>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>热门商户与商品</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ marginBottom: '16px', padding: '12px', background: '#EFF6FF', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', color: '#1E40AF' }}>
                <strong>华润超市</strong> 贡献最多物资（486件），其次是 <strong>大润发</strong>（352件）
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={merchantProductData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  formatter={(value: any) => [`${value} 件`, '物资数']}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="items" radius={[4, 4, 0, 0]}>
                  {merchantProductData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748B' }}>
              <strong>最受欢迎商品：</strong>纯牛奶、矿泉水、面包、酸奶
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📉</span>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>本周浪费率趋势</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                flex: 1,
                padding: '12px',
                background: '#DCFCE7',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#166534' }}>5.0%</div>
                <div style={{ fontSize: '12px', color: '#166534' }}>平均浪费率</div>
              </div>
              <div style={{
                flex: 1,
                padding: '12px',
                background: '#FEF3C7',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#92400E' }}>7.1%</div>
                <div style={{ fontSize: '12px', color: '#92400E' }}>周三最高</div>
              </div>
              <div style={{
                flex: 1,
                padding: '12px',
                background: '#DBEAFE',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1E40AF' }}>2.8%</div>
                <div style={{ fontSize: '12px', color: '#1E40AF' }}>周日最低</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={wasteRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, '浪费率']}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="rate" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>优化建议</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: '20px' } }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #10B981'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📍</span>
                    <span style={{ fontWeight: 600, color: '#065F46', fontSize: '14px' }}>区域优化</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#065F46', lineHeight: 1.8 }}>
                    <li>经开区、新吴区领取量偏低，建议增设宣传点</li>
                    <li>梁溪区需求旺盛，可考虑增加柜机数量</li>
                    <li>周末领取量明显高于工作日，建议周末增加志愿者</li>
                  </ul>
                </div>
              </Col>
              <Col span={8}>
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #3B82F6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>♿</span>
                    <span style={{ fontWeight: 600, color: '#1E40AF', fontSize: '14px' }}>特殊群体关怀</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#1E40AF', lineHeight: 1.8 }}>
                    <li>梁溪区困难群体集中（45人），建议上门配送服务</li>
                    <li>锡山区、惠山区可增设无障碍领取通道</li>
                    <li>为行动不便群众提供电话预约服务</li>
                  </ul>
                </div>
              </Col>
              <Col span={8}>
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #F59E0B'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📦</span>
                    <span style={{ fontWeight: 600, color: '#92400E', fontSize: '14px' }}>物资管理</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#92400E', lineHeight: 1.8 }}>
                    <li>周三浪费率最高（7.1%），建议减少该日物资投放</li>
                    <li>牛奶、面包易过期，建议优先分配</li>
                    <li>与华润超市建立应急调配机制</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
