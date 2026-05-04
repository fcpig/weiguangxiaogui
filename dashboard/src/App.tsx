import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router";
import routerProvider, {
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/locale/zh_CN";

import { Layout } from "./components/layout";
import "./styles/global.css";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { accessControlProvider } from "./providers/accessControl";
import { Login } from "./pages/login";
import { TOKEN_KEY } from "./providers/constants";

import { GovernmentDashboard } from "./pages/government/Dashboard";
import { Cabinets } from "./pages/government/Cabinets";
import { Merchants } from "./pages/government/Merchants";
import { Users } from "./pages/government/Users";
import { Messages } from "./pages/government/Messages";
import { Settings as GovernmentSettings } from "./pages/government/Settings";
import { ClaimRecords } from "./pages/government/ClaimRecords";
import { Volunteers } from "./pages/government/Volunteers";
import { Suggestions } from "./pages/government/Suggestions";
import { RiskControl } from "./pages/government/RiskControl";

import { EnterpriseDashboard } from "./pages/enterprise/Dashboard";
import { Devices } from "./pages/enterprise/Devices";
import { EnterpriseAnalytics } from "./pages/enterprise/Analytics";
import { Reports } from "./pages/enterprise/Reports";
import { EnterpriseMessages } from "./pages/enterprise/Messages";
import { EnterpriseSettings } from "./pages/enterprise/Settings";

// 登录页面路由组件 - 已登录用户根据类型跳转，未登录显示登录页
const LoginRoute = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Login />;
  }

  // 解析用户类型并跳转
  try {
    const user = JSON.parse(token);
    if (user.user_type === "merchant") {
      return <Navigate to="/enterprise" replace />;
    }
    return <Navigate to="/government" replace />;
  } catch {
    // Token 解析失败，清除并显示登录页
    localStorage.removeItem(TOKEN_KEY);
    return <Login />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <AntdApp>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                resources={[
                  {
                    name: "government",
                    list: "/government",
                    meta: {
                      label: "政府面板",
                    },
                  },
                  {
                    name: "cabinets",
                    list: "/government/cabinets",
                    meta: {
                      label: "柜机管理",
                      parent: "government",
                    },
                  },
                  {
                    name: "merchants",
                    list: "/government/merchants",
                    meta: {
                      label: "爱心商户",
                      parent: "government",
                    },
                  },
                  {
                    name: "users",
                    list: "/government/users",
                    meta: {
                      label: "用户管理",
                      parent: "government",
                    },
                  },
                  {
                    name: "messages",
                    list: "/government/messages",
                    meta: {
                      label: "超期预警",
                      parent: "government",
                    },
                  },
                  {
                    name: "settings",
                    list: "/government/settings",
                    meta: {
                      label: "系统设置",
                      parent: "government",
                    },
                  },
                  {
                    name: "claim-records",
                    list: "/government/claim-records",
                    meta: {
                      label: "领取记录",
                      parent: "government",
                    },
                  },
                  {
                    name: "volunteers",
                    list: "/government/volunteers",
                    meta: {
                      label: "志愿者管理",
                      parent: "government",
                    },
                  },
                  {
                    name: "suggestions",
                    list: "/government/suggestions",
                    meta: {
                      label: "优化建议",
                      parent: "government",
                    },
                  },
                  {
                    name: "risk-control",
                    list: "/government/risk-control",
                    meta: {
                      label: "智能风控",
                      parent: "government",
                      icon: "🛡️",
                    },
                  },
                  {
                    name: "enterprise",
                    list: "/enterprise",
                    meta: {
                      label: "商户面板",
                    },
                  },
                  {
                    name: "devices",
                    list: "/enterprise/devices",
                    meta: {
                      label: "物资管理",
                      parent: "enterprise",
                    },
                  },
                  {
                    name: "analytics",
                    list: "/enterprise/analytics",
                    meta: {
                      label: "物资统计",
                      parent: "enterprise",
                    },
                  },
                  {
                    name: "reports",
                    list: "/enterprise/reports",
                    meta: {
                      label: "领取记录",
                      parent: "enterprise",
                    },
                  },
                  {
                    name: "messages",
                    list: "/enterprise/messages",
                    meta: {
                      label: "预警通知",
                      parent: "enterprise",
                    },
                  },
                  {
                    name: "settings",
                    list: "/enterprise/settings",
                    meta: {
                      label: "系统设置",
                      parent: "enterprise",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "X450o0-E6FTdJ-yI6viu",
                }}
              >
                <Routes>
                  <Route path="/login" element={<LoginRoute />} />

                  <Route
                    element={
                      <Authenticated
                        key="layout-authenticated"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route path="/government" element={<GovernmentDashboard />} />
                    <Route path="/government/cabinets" element={<Cabinets />} />
                    <Route path="/government/merchants" element={<Merchants />} />
                    <Route path="/government/users" element={<Users />} />
                    <Route path="/government/messages" element={<Messages />} />
                    <Route path="/government/settings" element={<GovernmentSettings />} />
                    <Route path="/government/claim-records" element={<ClaimRecords />} />
                    <Route path="/government/volunteers" element={<Volunteers />} />
                    <Route path="/government/suggestions" element={<Suggestions />} />
                    <Route path="/government/risk-control" element={<RiskControl />} />

                    <Route path="/enterprise" element={<EnterpriseDashboard />} />
                    <Route path="/enterprise/devices" element={<Devices />} />
                    <Route path="/enterprise/analytics" element={<EnterpriseAnalytics />} />
                    <Route path="/enterprise/reports" element={<Reports />} />
                    <Route path="/enterprise/messages" element={<EnterpriseMessages />} />
                    <Route path="/enterprise/settings" element={<EnterpriseSettings />} />
                  </Route>

                  <Route path="*" element={<CatchAllNavigate to="/login" />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineKbarProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
