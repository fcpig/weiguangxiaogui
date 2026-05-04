import type { PropsWithChildren } from "react";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { NavLink, Outlet, useLocation } from "react-router";
import { AiChatButton } from "./AiChat";

const governmentMenuItems = [
  { key: "government", label: "控制台", path: "/government", icon: "📊" },
  { key: "cabinets", label: "柜机管理", path: "/government/cabinets", icon: "🗄️" },
  { key: "merchants", label: "爱心商户", path: "/government/merchants", icon: "🏪" },
  { key: "users", label: "用户管理", path: "/government/users", icon: "👥" },
  { key: "messages", label: "超期预警", path: "/government/messages", icon: "🔔" },
  { key: "claim-records", label: "领取记录", path: "/government/claim-records", icon: "📝" },
  { key: "volunteers", label: "志愿者管理", path: "/government/volunteers", icon: "🤝" },
  { key: "suggestions", label: "优化建议", path: "/government/suggestions", icon: "💡" },
  { key: "settings", label: "系统设置", path: "/government/settings", icon: "⚙️" },
];

const enterpriseMenuItems = [
  { key: "enterprise", label: "控制台", path: "/enterprise", icon: "📊" },
  { key: "devices", label: "物资管理", path: "/enterprise/devices", icon: "📦" },
  { key: "analytics", label: "物资统计", path: "/enterprise/analytics", icon: "📈" },
  { key: "reports", label: "投放记录", path: "/enterprise/reports", icon: "📝" },
  { key: "messages", label: "预警通知", path: "/enterprise/messages", icon: "🔔" },
  { key: "settings", label: "系统设置", path: "/enterprise/settings", icon: "⚙️" },
];

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity<{
    userType: string;
    name: string;
    phone: string;
  }>();
  const location = useLocation();

  const getUserType = () => {
    if (identity?.userType) {
      return identity.userType;
    }
    const token = localStorage.getItem("refine-auth");
    if (token) {
      try {
        const user = JSON.parse(token);
        return user.user_type;
      } catch {
        return null;
      }
    }
    return null;
  };

  const userType = getUserType();
  const menuItems = userType === "admin" ? governmentMenuItems : enterpriseMenuItems;
  const panelTitle = userType === "admin" ? "政府管理面板" : "商户管理面板";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          height: '64px',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
              }}
            >
              公
            </div>
            <div>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {panelTitle}
              </h1>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                扬名街道公益柜机系统
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#F1F5F9',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
              }}
            >
              {identity?.name?.charAt(0) || '用'}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, margin: 0, color: '#1E293B' }}>
                {identity?.name || "用户"}
              </p>
              <p style={{ fontSize: '12px', margin: 0, color: '#94A3B8' }}>
                {identity?.phone || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              transition: 'all 0.2s',
              background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
              color: '#DC2626',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            退出登录
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside
          style={{
            width: '240px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          }}
        >
          <nav style={{ flex: 1, padding: '16px' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {menuItems.map((item) => (
                <li key={item.key} style={{ marginBottom: '4px' }}>
                  <NavLink
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      background: isActive(item.path)
                        ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.4) 0%, rgba(59, 130, 246, 0.3) 100%)'
                        : 'transparent',
                      color: isActive(item.path) ? '#FFFFFF' : '#CBD5E1',
                      borderLeft: isActive(item.path) ? '3px solid #3B82F6' : '3px solid transparent',
                      boxShadow: isActive(item.path) ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#CBD5E1';
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ padding: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <AiChatButton />
          </div>
          <div
            style={{
              padding: '16px',
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.3)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            © 2024 扬名街道公益项目
          </div>
        </aside>

        <main style={{ flex: 1, padding: '24px', background: '#F8FAFC' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              minHeight: 'calc(100vh - 112px)',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0',
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
