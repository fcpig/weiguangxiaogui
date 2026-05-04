import { Row, Col, Card } from "antd";
import { useState, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const riskScoreData = [
  { name: "定位风险", value: 72, max: 100 },
  { name: "IP风险", value: 45, max: 100 },
  { name: "行为风险", value: 83, max: 100 },
  { name: "设备风险", value: 28, max: 100 },
  { name: "时间风险", value: 61, max: 100 },
];

const weeklyTrendData = [
  { date: "周一", location: 3, ip: 1, account: 2 },
  { date: "周二", location: 5, ip: 2, account: 1 },
  { date: "周三", location: 2, ip: 4, account: 3 },
  { date: "周四", location: 7, ip: 1, account: 2 },
  { date: "周五", location: 4, ip: 3, account: 5 },
  { date: "周六", location: 6, ip: 2, account: 1 },
  { date: "周日", location: 3, ip: 5, account: 4 },
];

const alertData = [
  { id: 1, type: "定位异常", level: "high", user: "张*明", time: "2分钟前", desc: "定位地址与常用位置偏差超过5公里" },
  { id: 2, type: "IP异常", level: "medium", user: "李*华", time: "15分钟前", desc: "IP地址频繁变更，疑似代理访问" },
  { id: 3, type: "账号风险", level: "low", user: "王*强", time: "1小时前", desc: "账号存在异常登录行为，建议关注" },
  { id: 4, type: "定位异常", level: "high", user: "陈*伟", time: "2小时前", desc: "短时间内跨城市定位变更" },
  { id: 5, type: "IP异常", level: "medium", user: "刘*芳", time: "3小时前", desc: "检测到可疑IP段访问" },
];

const levelColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export const RiskControl = () => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(156), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 40%)
            `,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%",
            background: "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(59, 130, 246, 0.03) 50px, rgba(59, 130, 246, 0.03) 51px)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, paddingTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: "#F8FAFC", textShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}>
              智能风控中心
            </h2>
            <p style={{ fontSize: "14px", color: "#94A3B8", marginTop: "8px" }}>
              实时监控 · 智能分析 · 主动防御
            </p>
          </div>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
              padding: "12px 20px",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>系统时间</div>
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#60A5FA", fontFamily: "monospace" }}>
              {currentTime.toLocaleTimeString("zh-CN")}
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={6}>
            <div
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.1), transparent 30%)",
                  animation: "rotate 3s linear infinite",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "#94A3B8" }}>定位检测不符</span>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#EF4444",
                      boxShadow: "0 0 10px #EF4444, 0 0 20px #EF4444",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
                <div style={{ fontSize: "42px", fontWeight: 700, color: "#F8FAFC", textShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}>
                  33
                </div>
                <div style={{ fontSize: "12px", color: "#EF4444", marginTop: "8px" }}>↑ 今日新增 5 次</div>
              </div>
              <style>{`
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
              `}</style>
            </div>
          </Col>

          <Col span={6}>
            <div
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.1), transparent 30%)",
                  animation: "rotate 3s linear infinite",
                  animationDelay: "-1s",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "#94A3B8" }}>IP异常次数</span>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#F59E0B",
                      boxShadow: "0 0 10px #F59E0B, 0 0 20px #F59E0B",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
                <div style={{ fontSize: "42px", fontWeight: 700, color: "#F8FAFC", textShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}>
                  18
                </div>
                <div style={{ fontSize: "12px", color: "#F59E0B", marginTop: "8px" }}>↑ 较昨日 +3 次</div>
              </div>
            </div>
          </Col>

          <Col span={6}>
            <div
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.1), transparent 30%)",
                  animation: "rotate 3s linear infinite",
                  animationDelay: "-2s",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "#94A3B8" }}>账号潜在风险</span>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#10B981",
                      boxShadow: "0 0 10px #10B981, 0 0 20px #10B981",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
                <div style={{ fontSize: "42px", fontWeight: 700, color: "#F8FAFC", textShadow: "0 0 30px rgba(16, 185, 129, 0.5)" }}>
                  12
                </div>
                <div style={{ fontSize: "12px", color: "#10B981", marginTop: "8px" }}>↓ 较昨日 -2 次</div>
              </div>
            </div>
          </Col>

          <Col span={6}>
            <div
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(59, 130, 246, 0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(139, 92, 246, 0.1) 100%)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "#94A3B8" }}>综合风险评分</span>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: "rgba(245, 158, 11, 0.2)",
                      border: "1px solid rgba(245, 158, 11, 0.4)",
                      fontSize: "12px",
                      color: "#F59E0B",
                      fontWeight: 600,
                    }}
                  >
                    中等
                  </div>
                </div>
                <div style={{ fontSize: "42px", fontWeight: 700, color: "#F8FAFC", textShadow: "0 0 30px rgba(245, 158, 11, 0.5)" }}>
                  58
                  <span style={{ fontSize: "18px", color: "#64748B", marginLeft: "4px" }}>/100</span>
                </div>
                <div style={{ fontSize: "12px", color: "#60A5FA", marginTop: "8px" }}>略高于安全阈值</div>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col span={8}>
            <Card
              style={{
                borderRadius: "16px",
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              styles={{ body: { padding: "24px" } }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#F8FAFC", margin: 0 }}>风险雷达图</h3>
                <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>多维度风险评估分析</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={riskScoreData}>
                  <PolarGrid stroke="rgba(59, 130, 246, 0.3)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <Radar
                    name="风险值"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col span={16}>
            <Card
              style={{
                borderRadius: "16px",
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              styles={{ body: { padding: "24px" } }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#F8FAFC", margin: 0 }}>异常趋势分析</h3>
                <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>近7天各类异常事件统计</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="colorLocation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorIp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAccount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{ color: "#F8FAFC" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="location"
                    stroke="#EF4444"
                    fill="url(#colorLocation)"
                    strokeWidth={2}
                    name="定位异常"
                  />
                  <Area
                    type="monotone"
                    dataKey="ip"
                    stroke="#F59E0B"
                    fill="url(#colorIp)"
                    strokeWidth={2}
                    name="IP异常"
                  />
                  <Area
                    type="monotone"
                    dataKey="account"
                    stroke="#10B981"
                    fill="url(#colorAccount)"
                    strokeWidth={2}
                    name="账号风险"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "3px", background: "#EF4444", borderRadius: "2px" }} />
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>定位异常</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "3px", background: "#F59E0B", borderRadius: "2px" }} />
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>IP异常</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "3px", background: "#10B981", borderRadius: "2px" }} />
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>账号风险</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "16px",
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              styles={{ body: { padding: "24px" } }}
            >
              <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#F8FAFC", margin: 0 }}>实时预警列表</h3>
                  <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>系统实时检测到的异常事件</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#EF4444",
                      animation: "pulse 1s ease-in-out infinite",
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "#EF4444", fontWeight: 500 }}>
                    {alertData.filter((a) => a.level === "high").length} 条高危预警
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {alertData.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      borderRadius: "12px",
                      background: "rgba(30, 41, 59, 0.6)",
                      border: `1px solid ${levelColors[alert.level] === "#EF4444" ? "rgba(239, 68, 68, 0.3)" : levelColors[alert.level] === "#F59E0B" ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(30, 41, 59, 0.9)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(30, 41, 59, 0.6)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: `${levelColors[alert.level]}20`,
                        border: `1px solid ${levelColors[alert.level]}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      {alert.level === "high" ? "🚨" : alert.level === "medium" ? "⚠️" : "📟"}
                    </div>
                    <div style={{ marginLeft: "16px", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: "#F8FAFC" }}>{alert.type}</span>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: `${levelColors[alert.level]}20`,
                            color: levelColors[alert.level],
                            border: `1px solid ${levelColors[alert.level]}40`,
                          }}
                        >
                          {alert.level === "high" ? "高危" : alert.level === "medium" ? "中危" : "低危"}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#94A3B8" }}>
                        <span style={{ color: "#60A5FA" }}>{alert.user}</span> · {alert.desc}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{alert.time}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: levelColors[alert.level],
                          marginTop: "4px",
                          cursor: "pointer",
                        }}
                      >
                        处理 →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};