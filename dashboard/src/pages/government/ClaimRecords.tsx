import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

interface ClaimRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  cabinet_code: string;
  item_name: string;
  claim_time: string;
}

const demoClaimRecords: ClaimRecord[] = [
  {
    id: "1",
    user_id: "USER-001",
    user_name: "张三",
    user_phone: "13800138000",
    cabinet_code: "CAB-A01",
    item_name: "纯牛奶",
    claim_time: "2026-04-23T08:30:00",
  },
  {
    id: "2",
    user_id: "USER-002",
    user_name: "李四",
    user_phone: "13900139000",
    cabinet_code: "CAB-A02",
    item_name: "矿泉水",
    claim_time: "2026-04-23T09:15:00",
  },
  {
    id: "3",
    user_id: "USER-003",
    user_name: "王五",
    user_phone: "13700137000",
    cabinet_code: "CAB-B01",
    item_name: "面包",
    claim_time: "2026-04-23T10:00:00",
  },
  {
    id: "4",
    user_id: "USER-001",
    user_name: "张三",
    user_phone: "13800138000",
    cabinet_code: "CAB-B02",
    item_name: "饼干",
    claim_time: "2026-04-22T14:30:00",
  },
  {
    id: "5",
    user_id: "USER-004",
    user_name: "赵六",
    user_phone: "13600136000",
    cabinet_code: "CAB-C01",
    item_name: "酸奶",
    claim_time: "2026-04-22T11:20:00",
  },
  {
    id: "6",
    user_id: "USER-005",
    user_name: "钱七",
    user_phone: "13500135000",
    cabinet_code: "CAB-C02",
    item_name: "果汁",
    claim_time: "2026-04-22T15:45:00",
  },
  {
    id: "7",
    user_id: "USER-002",
    user_name: "李四",
    user_phone: "13900139000",
    cabinet_code: "CAB-A03",
    item_name: "方便面",
    claim_time: "2026-04-21T09:00:00",
  },
  {
    id: "8",
    user_id: "USER-006",
    user_name: "孙八",
    user_phone: "13400134000",
    cabinet_code: "CAB-B03",
    item_name: "火腿肠",
    claim_time: "2026-04-21T10:30:00",
  },
  {
    id: "9",
    user_id: "USER-003",
    user_name: "王五",
    user_phone: "13700137000",
    cabinet_code: "CAB-A01",
    item_name: "八宝粥",
    claim_time: "2026-04-21T14:15:00",
  },
  {
    id: "10",
    user_id: "USER-007",
    user_name: "周九",
    user_phone: "13300133000",
    cabinet_code: "CAB-C03",
    item_name: "水果",
    claim_time: "2026-04-20T16:00:00",
  },
  {
    id: "11",
    user_id: "USER-004",
    user_name: "赵六",
    user_phone: "13600136000",
    cabinet_code: "CAB-B01",
    item_name: "卤蛋",
    claim_time: "2026-04-20T08:45:00",
  },
  {
    id: "12",
    user_id: "USER-008",
    user_name: "吴十",
    user_phone: "13200132000",
    cabinet_code: "CAB-A02",
    item_name: "薯片",
    claim_time: "2026-04-19T11:30:00",
  },
];

export const ClaimRecords = () => {
  const columns: ColumnsType<ClaimRecord> = [
    {
      title: "用户姓名",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "手机号",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "柜机编号",
      dataIndex: "cabinet_code",
      key: "cabinet_code",
    },
    {
      title: "物品名称",
      dataIndex: "item_name",
      key: "item_name",
    },
    {
      title: "领取时间",
      dataIndex: "claim_time",
      key: "claim_time",
      render: (date: string) => (date ? new Date(date).toLocaleString() : "-"),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">领取记录</h2>
      <Table
        dataSource={demoClaimRecords}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </div>
  );
};
