# 扬名街道公益柜机系统 - 管理后台

<div align="center" style="margin: 30px;">
    <h1>🏠 扬名街道公益柜机系统</h1>
    <p>基于 Refine 框架构建的公益物资管理平台</p>
</div>

## 📋 项目简介

本项目是**扬名街道公益柜机系统**的管理后台，采用 React + TypeScript 开发，基于 Refine 框架构建。主要服务于政府管理部门和爱心商户，实现公益物资的智能化管理。

## 🏗️ 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.1.0 | UI 框架 |
| TypeScript | 5.8.3 | 类型系统 |
| Refine | 5.0.8 | 后台管理框架 |
| Ant Design | 5.29.3 | UI 组件库 |
| Tailwind CSS | 4.1.8 | 样式方案 |
| React Router | 7.0.2 | 路由管理 |
| InsForge SDK | 1.2.5 | 后端数据库 |
| Recharts | 3.8.1 | 图表可视化 |

### 项目架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │ Data Provider │  │ Auth Provider │  │ AccessControl Provider │ │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬──────────┘     │
│         │                │                     │                 │
│         ▼                ▼                     ▼                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   InsForge Database                      │    │
│  │   (users, cabinets, items, merchants, access_rules...)  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│   Government Panel  │               │  Enterprise Panel   │
│   (政府管理面板)      │               │   (商户管理面板)     │
├─────────────────────┤               ├─────────────────────┤
│ • 控制台             │               │ • 控制台             │
│ • 柜机管理           │               │ • 物资管理           │
│ • 爱心商户           │               │ • 物资统计           │
│ • 用户管理           │               │ • 领取记录           │
│ • 超期预警           │               │ • 预警通知           │
│ • 领取记录           │               │ • 系统设置           │
│ • 系统设置           │               │                     │
└─────────────────────┘               └─────────────────────┘
```

### 目录结构

```
src/
├── components/
│   └── layout/
│       └── index.tsx          # 整体布局组件（侧边栏 + 顶部导航）
├── pages/
│   ├── government/           # 政府管理面板页面
│   │   ├── Dashboard.tsx      # 控制台首页
│   │   ├── Cabinets.tsx       # 柜机管理
│   │   ├── Merchants.tsx      # 爱心商户管理
│   │   ├── Users.tsx          # 用户管理
│   │   ├── Messages.tsx       # 超期预警
│   │   ├── ClaimRecords.tsx   # 领取记录
│   │   └── Settings.tsx       # 系统设置
│   ├── enterprise/            # 商户管理面板页面
│   │   ├── Dashboard.tsx      # 控制台首页
│   │   ├── Devices.tsx        # 物资管理
│   │   ├── Analytics.tsx      # 物资统计
│   │   ├── Reports.tsx        # 领取记录
│   │   ├── Messages.tsx       # 预警通知
│   │   └── Settings.tsx       # 系统设置
│   └── login/
│       └── index.tsx          # 登录页面
├── providers/
│   ├── data.ts                 # 数据提供者（数据库CRUD）
│   ├── auth.ts                 # 认证提供者（登录/登出/权限）
│   ├── accessControl.ts       # 访问控制提供者
│   ├── constants.ts            # 常量定义
│   ├── insforge.ts             # InsForge 客户端配置
│   └── data.ts                 # 数据交互逻辑
└── styles/
    ├── global.css              # 全局样式
    └── variables.css           # CSS 变量定义
```

## 🔑 核心模块

### 1. 数据层 (Data Provider)

`src/providers/data.ts` 实现了 Refine 的 DataProvider 接口，负责与 InsForge PostgreSQL 数据库的交互：

```typescript
// 主要方法
- getList()      // 获取列表（支持分页、排序、筛选）
- getOne()       // 获取单个记录
- create()       // 创建新记录
- update()       // 更新记录
- deleteOne()    // 删除记录
- getMany()      // 批量获取
- custom()       // 自定义查询
```

### 2. 认证层 (Auth Provider)

`src/providers/auth.ts` 处理用户认证逻辑：

```typescript
// 登录流程
1. 通过手机号查询用户
2. 验证密码（默认密码：123456）
3. 根据用户类型跳转：
   - admin → /government（政府面板）
   - merchant → /enterprise（商户面板）

// 用户类型
- admin: 政府管理员，拥有全部权限
- merchant: 爱心商户，管理自己的物资
- vulnerable: 困难群体，领取物资
```

### 3. 权限控制 (Access Control)

`src/providers/accessControl.ts` 实现基于角色的访问控制：

```typescript
// admin (政府) 可访问：
- government/* 所有路由

// merchant (商户) 可访问：
- enterprise/* 所有路由
```

### 4. 布局组件 (Layout)

`src/components/layout/index.tsx` 提供统一的页面布局：

- **顶部栏**：Logo、面板标题、用户信息、退出按钮
- **侧边栏**：根据用户类型动态显示菜单项
- **内容区**：渲染页面内容

## 👥 用户角色与权限

| 角色 | 描述 | 可访问面板 | 主要功能 |
|------|------|-----------|---------|
| admin | 政府管理员 | /government | 柜机管理、商户管理、用户管理、预警查看 |
| merchant | 爱心商户 | /enterprise | 物资投放、库存管理、统计报表、预警处理 |

## 💻 运行项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 🔌 数据库

项目使用 InsForge PostgreSQL 数据库，核心表结构：

- **users** - 用户表（困难群体、商户、管理员）
- **cabinets** - 柜机设备表
- **items** - 物资库存表
- **merchants** - 商家表
- **access_rules** - 权限规则表（每日领取限制）
- **daily_counters** - 每日计数器表
- **expiry_alerts** - 超期提醒表
- **feedback** - 用户反馈表
- **merchant_users** - 商家管理员关联表

详细表结构请参考 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## 📝 登录说明

测试账号（密码统一为 `123456`）：

| 手机号 | 用户类型 | 角色 |
|-------|---------|------|
| 13800000001 | vulnerable | 困难群体 |
| 13800000003 | merchant | 爱心便利店管理员 |
| 13800000005 | admin | 街道管理员 |

## License

MIT
