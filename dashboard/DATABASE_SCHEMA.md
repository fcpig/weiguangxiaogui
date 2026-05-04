# 扬名街道公益柜机系统 - 数据库架构文档

## 📋 概述

本文档详细记录了扬名街道公益柜机系统的数据库架构，基于 insforge PostgreSQL 数据库。

### 数据库版本
- **数据库类型**: PostgreSQL
- **建表日期**: 2026-04-14
- **最后更新**: 2026-04-14
- **表数量**: 9 张

---

## 📊 数据模型图

```
┌─────────────────┐
│     users       │◄────────────────┐
│ (用户表)         │                 │
└────────┬────────┘                 │
         │ 1:N                      │
         ▼                          │
┌─────────────────┐                 │
│  access_rules   │                 │ 1:N
│ (权限规则表)     │                 │
└─────────────────┘                 │
                                      │
┌─────────────────┐                 │
│    cabinets     │◄────────────────┤
│ (柜机设备表)     │                 │
└────────┬────────┘                 │
         │ 1:N                      │
         ▼                          │
┌─────────────────┐                 │
│     items       │─────────────────┼──────► users (merchant_id)
│ (物资库存表)     │                 │  N:1
└────────┬────────┘                 │
         │ 1:N                      │
         ▼                          │
┌─────────────────┐                 │
│  expiry_alerts  │                 │
│ (超期提醒表)     │                 │
└─────────────────┘                 │

┌─────────────────┐
│ daily_counters  │◄──── users (user_id)
│ (每日计数器表)   │
└─────────────────┘

┌─────────────────┐
│    feedback     │◄──── users (user_id)
│ (用户反馈表)     │     cabinets (cabinet_code)
└─────────────────┘

┌─────────────────┐
│    merchants    │◄────────────────────┐
│ (商家表)         │                     │
└────────┬────────┘                     │
         │ 1:N                          │ 1:1
         ▼                              │
┌─────────────────┐                     │
│ merchant_users  │─────────────────────┼──────► users
│ (商家管理员表)   │                     │
└─────────────────┘                     │
         │                              │
         │ 1:N                          │
         ▼                              │
┌─────────────────┐                     │
│     items       │─────────────────────┘
│ (物资库存表)     │
└─────────────────┘
```

---

## 📝 表结构详情

### 1. users（用户表）

存储系统中的所有用户，包括困难群体、爱心商户和管理员。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 用户唯一标识 |
| phone | VARCHAR(11) | UNIQUE, NOT NULL | 手机号（登录账号） |
| user_type | VARCHAR(20) | NOT NULL, CHECK | 用户类型：vulnerable（困难群体）、merchant（爱心商户）、admin（管理员） |
| name | VARCHAR(100) | NOT NULL | 用户姓名/名称 |
| id_number | VARCHAR(18) | NULL | 身份证号码 |
| avatar_url | TEXT | NULL | 头像 URL |
| status | VARCHAR(10) | DEFAULT 'active' | 状态：active（正常）、disabled（禁用）、deleted（已删除） |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_users_phone` - 手机号索引
- `idx_users_type` - 用户类型索引
- `idx_users_status` - 状态索引

**关联关系：**
- 1:N → access_rules（一个用户可以有多个权限规则）
- 1:N → items（一个商户可以投放多个物资）
- 1:N → daily_counters（一个用户每日有多个计数器记录）
- 1:N → expiry_alerts（一个商户可以有多个超期提醒）
- 1:N → feedback（一个用户可以提交多条反馈）

---

### 2. access_rules（权限规则表）

存储用户的领取权限规则，控制困难群体的每日领取次数和物资类别限制。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 规则唯一标识 |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) | 关联的用户ID |
| cabinet_id | VARCHAR(50) | NULL | 适用的柜机编号，NULL表示所有柜机 |
| daily_limit | INTEGER | DEFAULT 2 | 每日总领取次数限制 |
| food_limit | INTEGER | DEFAULT 1 | 每日食品类领取次数限制 |
| drink_limit | INTEGER | DEFAULT 1 | 每日饮料类领取次数限制 |
| is_active | BOOLEAN | DEFAULT true | 规则是否启用 |
| start_date | DATE | NULL | 规则生效开始日期 |
| end_date | DATE | NULL | 规则生效结束日期 |
| remark | TEXT | NULL | 备注说明 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_access_rules_user` - 用户ID索引
- `idx_access_rules_cabinet` - 柜机编号索引

**关联关系：**
- N:1 → users（多个规则属于一个用户）

---

### 3. cabinets（柜机设备表）

存储公益柜机的基本信息和位置数据。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 柜机唯一标识 |
| cabinet_code | VARCHAR(50) | UNIQUE, NOT NULL | 柜机编号（如：YM-001） |
| location_name | VARCHAR(100) | NOT NULL | 柜机位置名称 |
| location_lat | REAL | NULL | 纬度坐标 |
| location_lng | REAL | NULL | 经度坐标 |
| total_slots | INTEGER | DEFAULT 30 | 柜机总槽位数量 |
| status | VARCHAR(20) | DEFAULT 'online' | 状态：online（在线）、offline（离线）、maintenance（维护中） |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_cabinet_code` - 柜机编号唯一索引

**关联关系：**
- 1:N → items（一个柜机可以存放多种物资）

---

### 4. items（物资库存表）

存储柜机内的物资信息，包括库存数量、保质期等。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 物资唯一标识 |
| cabinet_id | VARCHAR(50) | NOT NULL | 所属柜机编号 |
| item_code | VARCHAR(50) | NOT NULL, UNIQUE WITH cabinet_id | 物资编码 |
| item_name | VARCHAR(100) | NOT NULL | 物资名称 |
| category | VARCHAR(20) | NOT NULL, CHECK | 物资类别：food（食品）、drink（饮料）、daily（日用品） |
| current_quantity | INTEGER | DEFAULT 0 | 当前库存数量 |
| max_capacity | INTEGER | DEFAULT 10 | 最大容量 |
| merchant_id | UUID | FOREIGN KEY → merchants(id) | 投放商户ID |
| put_time | TIMESTAMP | NULL | 最近投放时间 |
| expiry_date | TIMESTAMP | NULL | 保质期截止日期 |
| status | VARCHAR(20) | DEFAULT 'available' | 状态：available（可用）、expired（已过期）、removed（已下架）、finished（已领完） |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_items_cabinet` - 柜机索引
- `idx_items_expiry` - 保质期索引
- `idx_items_status` - 状态索引
- `idx_items_merchant` - 商户索引

**约束：**
- UNIQUE(cabinet_id, item_code) - 同一柜机内物资编码唯一

**关联关系：**
- N:1 → merchants（多个物资属于一个商家）
- N:1 → cabinets（多个物资属于一个柜机）

---

### 5. daily_counters（每日计数器表）

用于加速权限检查，记录每个用户每日的领取次数统计。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 记录唯一标识 |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) | 用户ID |
| counter_date | DATE | NOT NULL | 统计日期 |
| total_opens | INTEGER | DEFAULT 0 | 今日开柜总次数 |
| food_count | INTEGER | DEFAULT 0 | 今日食品领取次数 |
| drink_count | INTEGER | DEFAULT 0 | 今日饮料领取次数 |
| daily_count | INTEGER | DEFAULT 0 | 今日日用品领取次数 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_counters_user_date` - 用户ID+日期复合索引

**约束：**
- UNIQUE(user_id, counter_date) - 每个用户每天只有一条记录

**关联关系：**
- N:1 → users（多条计数器记录属于一个用户）

---

### 6. expiry_alerts（超期物资提醒表）

记录即将过期或已过期的物资提醒信息。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 提醒唯一标识 |
| item_id | UUID | NOT NULL, FOREIGN KEY → items(id) | 关联物资ID |
| cabinet_code | VARCHAR(50) | FOREIGN KEY → cabinets(cabinet_code) | 柜机编号 |
| merchant_id | UUID | FOREIGN KEY → merchants(id) | 商户ID |
| expiry_date | TIMESTAMP | NULL | 过期日期 |
| alert_status | VARCHAR(20) | DEFAULT 'pending' | 提醒状态：pending（待处理）、notified（已通知）、processed（已处理） |
| notified_at | TIMESTAMP | NULL | 通知时间 |
| processed_at | TIMESTAMP | NULL | 处理时间 |
| remark | TEXT | NULL | 备注说明 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_alerts_status` - 提醒状态索引
- `idx_alerts_expiry` - 过期日期索引
- `idx_alerts_merchant` - 商户索引

**关联关系：**
- N:1 → items（多条提醒属于一个物资）
- N:1 → users（多条提醒属于一个商户）

---

### 7. feedback（用户反馈表）

存储用户对柜机或服务的反馈建议。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 反馈唯一标识 |
| user_id | UUID | FOREIGN KEY → users(id) | 提交用户ID |
| cabinet_code | VARCHAR(50) | FOREIGN KEY → cabinets(cabinet_code) | 反馈柜机编号 |
| rating | INTEGER | CHECK (1-5) | 评分（1-5分） |
| content | TEXT | NULL | 反馈内容 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 提交时间 |

**索引：**
- `idx_feedback_time` - 提交时间索引
- `idx_feedback_cabinet` - 柜机索引

**关联关系：**
- N:1 → users（多条反馈属于一个用户）
- N:1 → cabinets（多条反馈属于一个柜机）

---

### 8. merchants（商家表）

存储爱心商家的基本信息。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 商家唯一标识 |
| merchant_code | VARCHAR(50) | UNIQUE, NOT NULL | 商家编号（如：M001） |
| merchant_name | VARCHAR(100) | NOT NULL | 商家名称 |
| contact_person | VARCHAR(100) | NULL | 联系人姓名 |
| contact_phone | VARCHAR(20) | NULL | 联系电话 |
| business_license_url | TEXT | NULL | 营业执照URL |
| address | TEXT | NULL | 商家地址 |
| description | TEXT | NULL | 商家描述 |
| logo_url | TEXT | NULL | 商家Logo URL |
| status | VARCHAR(20) | DEFAULT 'active' | 状态：active（正常）、disabled（禁用） |
| total_donations | INTEGER | DEFAULT 0 | 总捐赠次数/数量 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_merchants_code` - 商家编号索引
- `idx_merchants_status` - 状态索引

**关联关系：**
- 1:N → merchant_users（一个商家可以有多个管理员账号）
- 1:N → items（一个商家可以投放多个物资）

---

### 9. merchant_users（商家管理员关联表）

关联商家和用户账号，一个商家可以有多个管理员。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 记录唯一标识 |
| merchant_id | UUID | NOT NULL, FOREIGN KEY → merchants(id) | 商家ID |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) | 用户ID |
| role | VARCHAR(20) | DEFAULT 'admin' | 角色：admin（管理员） |
| is_active | BOOLEAN | DEFAULT true | 是否启用 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- `idx_merchant_users_merchant` - 商家ID索引
- `idx_merchant_users_user` - 用户ID索引

**约束：**
- UNIQUE(merchant_id, user_id) - 商家和用户组合唯一

**关联关系：**
- N:1 → merchants（多条关联属于一个商家）
- N:1 → users（多条关联属于一个用户）

---

## 📝 AI 模型配置（ai_models）

存储系统中配置的 AI 模型信息，用于提供项目优化建议和为老人提供使用帮助。

| 字段名 | 数据类型 | 约束 | 说明 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 模型唯一标识 |
| name | VARCHAR(100) | NOT NULL | 自定义名称（用户友好的名称） |
| provider | VARCHAR(50) | NOT NULL | 模型厂商：deepseek、kimi、minimax、qwen、豆包、智谱、siliconflow |
| model_id | VARCHAR(100) | NOT NULL | 模型标识符（API调用时使用的模型名称，如 deepseek-ai/DeepSeek-V2.5） |
| api_url | TEXT | NOT NULL | API调用链接 |
| api_key | TEXT | NOT NULL | API密钥 |
| is_active | BOOLEAN | DEFAULT false | 是否启用（同一时间只能有一个模型启用） |
| description | TEXT | NULL | 模型描述或用途说明 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- `idx_ai_models_provider` - 模型厂商索引
- `idx_ai_models_active` - 启用状态索引

**支持的模型厂商与标识符示例：**

| 厂商 | 模型标识符示例 |
|------|----------------|
| DeepSeek | deepseek-ai/DeepSeek-V2.5, deepseek-ai/DeepSeek-V3, deepseek-ai/DeepSeek-R1 |
| Kimi | moonshotai/Kimi-K2-Instruct, moonshotai/k1.5 |
| MiniMax | MiniMaxLab/MiniMax-Text-01 |
| Qwen | Qwen/QwQ-32B, Qwen/Qwen2.5-72B-Instruct, Qwen/Qwen2.5-Coder-32B-Instruct |
| 豆包 | doubao-pro-32k, doubao-o1-32k |
| 智谱 | THUDM/GLM-4-Flash, THUDM/GLM-4V-Flash |
| 硅基流动 | deepseek-ai/DeepSeek-V2.5, Qwen/Qwen2.5-72B-Instruct, BAAI/bge-large-zh-v1.5 |

**API调用示例（硅基流动）：**
```json
POST https://api.siliconflow.cn/v1/chat/completions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "deepseek-ai/DeepSeek-V2.5",
  "messages": [{"role": "user", "content": "你好"}]
}
```

---

## 🔗 实体关系汇总

### 用户类型关系图

```
┌─────────────────────────────────────────────────────────────┐
│                         users                               │
├──────────────┬──────────────┬───────────────────────────────┤
│ vulnerable   │   merchant   │            admin               │
│ (困难群体)    │  (爱心商户)  │          (管理员)             │
├──────────────┼──────────────┼───────────────────────────────┤
│ • 领取物资    │ • 投放物资    │ • 管理柜机                    │
│ • 查看权限    │ • 查看库存    │ • 管理用户                    │
│ • 提交反馈    │ • 处理提醒    │ • 查看统计                    │
└──────────────┴──────────────┴───────────────────────────────┘
```

### 数据流向

```
商户投放物资                    系统管理                       困难群体领取
    │                            │                              │
    ▼                            ▼                              ▼
┌──────┐                  ┌────────────┐                ┌──────────┐
│items │                  │  cabinets  │                │access_   │
│      │◄─────────────────│            │                │rules     │
└──────┘                  └────────────┘                └────┬─────┘
    │                                                         │
    │                         ▼                              │
    │                  ┌──────────────┐                       │
    │                  │daily_counters│◄──────────────────────┘
    │                  └──────────────┘
    │
    ▼
┌──────────────┐
│expiry_alerts │
└──────────────┘
```

---

## 📌 业务规则说明

### 1. 用户类型权限

| 用户类型 | 可执行操作 |
|----------|------------|
| **vulnerable** | 登录、查看个人权限、领取物资（受规则限制）、提交反馈 |
| **merchant** | 登录、投放物资、管理物资、处理超期提醒、查看库存统计 |
| **admin** | 管理系统用户、管理柜机、查看所有统计数据、审核反馈 |

### 2. 物资状态流转

```
available（可用） ──────► expired（已过期）
       │                      │
       │                      ▼
       │               processed（已处理）
       │
       ▼
  finished（已领完）
       │
       ▼
  removed（已下架）
```

### 3. 提醒状态流转

```
pending（待处理） ──────► notified（已通知） ──────► processed（已处理）
```

---

## 📊 初始化数据

### 用户数据

| phone | user_type | name | status |
|-------|-----------|------|--------|
| 13800000001 | vulnerable | 张三（困难群体） | active |
| 13800000002 | vulnerable | 李四（残疾人） | active |
| 13800000003 | merchant | 爱心便利店 | active |
| 13800000004 | merchant | 健康食品超市 | active |
| 13800000005 | admin | 街道管理员 | active |

### 柜机数据

| cabinet_code | location_name | location_lat | location_lng | total_slots |
|--------------|---------------|--------------|--------------|-------------|
| YM-001 | 扬名街道社区中心 | 31.0456 | 121.5244 | 30 |
| YM-002 | 扬名街道文化广场 | 31.0461 | 121.5251 | 30 |

### 权限规则数据

| user_id | cabinet_id | daily_limit | food_limit | drink_limit | is_active |
|---------|------------|-------------|------------|-------------|-----------|
| 13800000001 | NULL | 2 | 1 | 1 | true |
| 13800000002 | NULL | 3 | 1 | 1 | true |

### 物资数据

| cabinet_id | item_code | item_name | category | current_quantity | max_capacity | merchant | status |
|------------|-----------|-----------|----------|------------------|--------------|----------|--------|
| YM-001 | RICE-001 | 大米(5kg) | food | 8 | 10 | 爱心便利店 | available |
| YM-001 | WATER-001 | 矿泉水(24瓶) | drink | 15 | 20 | 爱心便利店 | available |
| YM-001 | SOAP-001 | 肥皂(200g) | daily | 12 | 15 | 健康食品超市 | available |
| YM-002 | OIL-001 | 食用油(5L) | food | 5 | 8 | 健康食品超市 | available |

### 商家数据

| merchant_code | merchant_name | contact_person | contact_phone | address | description | total_donations |
|--------------|---------------|----------------|--------------|---------|-------------|-----------------|
| M001 | 爱心便利店 | 王老板 | 13800000003 | 扬名街道108号 | 社区爱心便利店，主要捐赠食品和日用品 | 128 |
| M002 | 健康食品超市 | 李经理 | 13800000004 | 扬名街道205号 | 专业健康食品店，捐赠有机食品和矿泉水 | 86 |
| M003 | 肯德基（扬名店） | 张经理 | 13800000006 | 扬名街道商业中心1楼 | 全球知名快餐连锁品牌，定期捐赠余量食品 | 256 |
| M004 | 麦当劳（社区店） | 李店长 | 13800000007 | 扬名街道购物广场 | 国际快餐品牌，积极参与公益活动 | 189 |
| M005 | 华润万家超市 | 王主管 | 13800000008 | 扬名街道购物中心B1 | 大型连锁超市，捐赠各类食品和日用品 | 342 |
| M006 | 永和大王 | 赵老板 | 13800000009 | 扬名街道餐饮街 | 知名快餐连锁，专注豆浆油条等健康食品 | 156 |

### 商家管理员关联数据

| merchant_code | user_phone | role |
|--------------|------------|------|
| M001 | 13800000003 | admin |
| M002 | 13800000004 | admin |
| M003 | 13800000006 | admin |
| M004 | 13800000007 | admin |
| M005 | 13800000008 | admin |
| M006 | 13800000009 | admin |

---

## ⚠️ 注意事项

1. **日志表暂未创建**：根据业务规划，`cabinet_operations`（柜机操作日志）和 `transactions`（物资交易记录）表暂时不创建，计划使用时序数据库存储。

2. **UUID 主键**：所有表使用 UUID 作为主键，确保分布式环境下的唯一性。

3. **时间戳处理**：PostgreSQL 中使用 `CURRENT_TIMESTAMP` 和 `NOW()` 处理时间，注意时区问题。

4. **外键约束**：使用了 `ON DELETE CASCADE` 策略，删除主表数据时会自动删除关联数据。

---

## 🔧 维护记录

| 日期 | 操作 | 说明 |
|------|------|------|
| 2026-04-14 | 初始化建表 | 从 SQLite 迁移到 PostgreSQL，创建全部7张表 |
| 2026-04-14 | 初始化数据 | 插入演示用户、柜机、权限规则、物资数据 |
| 2026-04-14 | 新增商家表 | 创建 merchants 和 merchant_users 表 |
| 2026-04-14 | 商家数据 | 插入爱心便利店、健康食品超市示例数据 |
| 2026-04-14 | 修复关联 | items.merchant_id外键从users改为merchants表 |
