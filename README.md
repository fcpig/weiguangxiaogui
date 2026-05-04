# 微光扬名 - 公益柜机物资管理系统

**扬名街道公益柜机系统** — 基于物联网与数字化管理的公益物资分发平台

[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square\&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6?style=flat-square\&logo=typescript)](https://www.typescriptlang.org/)
[![Refine](https://img.shields.io/badge/Refine-5.0.8-1abc9c?style=flat-square)](https://refine.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.29.3-1890ff?style=flat-square\&logo=antdesign)](https://ant.design/)

<br />

## 🎯 项目简介

微光扬名是面向街道社区的公益物资智能管理平台，通过物联网柜机连接爱心商户与困难群体，实现物资的便捷捐赠、领取与全流程监管。

## ✨ 核心功能

| 模块   | 功能描述                   |
| ---- | ---------------------- |
| 柜机管理 | 柜机设备状态监控、位置管理、物资库存实时同步 |
| 物资管理 | 物资入库、分配、领取记录全流程追踪      |
| 爱心商户 | 商户入驻、物资投放、统计报表         |
| 预警系统 | 超期未领取提醒、库存不足预警         |
| 权限管理 | 政府管理员 / 商户 / 困难群众三级角色  |

## 🛠 技术栈

### 管理后台 (dashboard)

| 技术                    | 用途             |
| --------------------- | -------------- |
| React 19 + TypeScript | UI 框架与类型安全     |
| Refine 5              | 后台管理框架         |
| Ant Design 5          | UI 组件库         |
| Tailwind CSS 4        | 样式方案           |
| InsForge SDK          | PostgreSQL 数据库 |
| Recharts              | 数据可视化          |

### 用户端 (user-app)

| 技术      | 用途       |
| ------- | -------- |
| uni-app | 跨平台小程序开发 |
| Vue 3   | 前端框架     |

## 📂 项目结构

```
微光扬名/
├── dashboard/          # 管理后台 (React + Refine)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── government/   # 政府管理面板
│   │   │   └── enterprise/   # 商户管理面板
│   │   └── providers/        # 数据层、认证、权限
│   └── package.json
│
└── user-app/
    └── 微光扬名/       # 用户端小程序 (uni-app)
        ├── pages/      # 地图、物资、我的
        └── utils/      # API、地图、认证
```

## 🔧 环境配置

开源前请先配置环境变量：

### 管理后台 (dashboard)

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp dashboard/.env.example dashboard/.env
```

```env
VITE_INSFORGE_URL=your_insforge_url_here
VITE_INSFORGE_ANON_KEY=your_insforge_anon_key_here
VITE_DEFAULT_PASSWORD=123456
```

### 用户端 (user-app)

```bash
cp user-app/微光扬名/.env.example user-app/微光扬名/.env
```

```env
API_BASE_URL=https://your-project.ap-southeast.insforge.app
ANON_TOKEN=your_anon_token_here
```

> ⚠️ **注意**: `.env` 文件已加入 `.gitignore`，请勿提交真实凭证。

## 🚀 快速开始

### 管理后台

```bash
cd dashboard
pnpm install
pnpm dev
```

### 用户端

```bash
cd user-app/微光扬名
pnpm install
# 使用 HBuilderX 或 uni-cli 运行
```

## 👥 用户角色

| 角色    | 说明           |
| ----- | ------------ |
| 政府管理员 | 全面监管柜机、商户、用户 |
| 爱心商户  | 管理物资投放与库存    |
| 困难群众  | 扫码领取物资       |

## 📄 License

MIT
