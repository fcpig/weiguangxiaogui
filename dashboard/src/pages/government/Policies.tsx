import { useTable } from "@refinedev/antd";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface AccessRule {
  id: string;
  user_id: string;
  cabinet_id: string;
  daily_limit: number;
  food_limit: number;
  drink_limit: number;
  is_active: boolean;
}

export const Policies = () => {
  const { tableProps } = useTable<AccessRule>({
    resource: "access_rules",
  });

  const columns: ColumnsType<AccessRule> = [
    {
      title: "用户ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "柜机编号",
      dataIndex: "cabinet_id",
      key: "cabinet_id",
      render: (val: string) => val || "全部柜机",
    },
    {
      title: "每日限制",
      dataIndex: "daily_limit",
      key: "daily_limit",
    },
    {
      title: "食品限制",
      dataIndex: "food_limit",
      key: "food_limit",
    },
    {
      title: "饮料限制",
      dataIndex: "drink_limit",
      key: "drink_limit",
    },
    {
      title: "状态",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "启用" : "禁用"}</Tag>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">领取规则配置</h2>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </div>
  );
};
