import { Table, Tag, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Volunteer {
  id: string;
  name: string;
  phone: string;
  shift_date: string;
  shift_time: string;
  cabinet_code: string;
  total_hours: number;
  remark: string;
}

const demoVolunteers: Volunteer[] = [
  {
    id: "1",
    name: "陈小明",
    phone: "13800138001",
    shift_date: "2026-04-20",
    shift_time: "上午",
    cabinet_code: "CAB-A01",
    total_hours: 12,
    remark: "长期志愿者，周末固定值班",
  },
  {
    id: "2",
    name: "林小红",
    phone: "13900139002",
    shift_date: "2026-04-20",
    shift_time: "下午",
    cabinet_code: "CAB-B01",
    total_hours: 8,
    remark: "负责老年用户引导",
  },
  {
    id: "3",
    name: "张建国",
    phone: "13700137003",
    shift_date: "2026-04-21",
    shift_time: "上午",
    cabinet_code: "CAB-A02",
    total_hours: 15,
    remark: "有急救证书，可处理突发情况",
  },
  {
    id: "4",
    name: "王秀英",
    phone: "13600136004",
    shift_date: "2026-04-21",
    shift_time: "下午",
    cabinet_code: "CAB-C01",
    total_hours: 10,
    remark: "熟悉各类物资存放",
  },
  {
    id: "5",
    name: "刘德华",
    phone: "13500135005",
    shift_date: "2026-04-22",
    shift_time: "上午",
    cabinet_code: "CAB-B02",
    total_hours: 6,
    remark: "新志愿者，需要培训",
  },
  {
    id: "6",
    name: "赵雪梅",
    phone: "13400134006",
    shift_date: "2026-04-22",
    shift_time: "下午",
    cabinet_code: "CAB-A03",
    total_hours: 20,
    remark: "骨干志愿者，协助管理",
  },
  {
    id: "7",
    name: "孙伟",
    phone: "13300133007",
    shift_date: "2026-04-23",
    shift_time: "上午",
    cabinet_code: "CAB-C02",
    total_hours: 4,
    remark: "大学生实习",
  },
  {
    id: "8",
    name: "周敏",
    phone: "13200132008",
    shift_date: "2026-04-23",
    shift_time: "下午",
    cabinet_code: "CAB-B03",
    total_hours: 18,
    remark: "认真负责，用户评价好",
  },
  {
    id: "9",
    name: "吴强",
    phone: "13100131009",
    shift_date: "2026-04-24",
    shift_time: "上午",
    cabinet_code: "CAB-A01",
    total_hours: 9,
    remark: "负责早晚高峰时段",
  },
  {
    id: "10",
    name: "郑芳",
    phone: "13000130010",
    shift_date: "2026-04-24",
    shift_time: "下午",
    cabinet_code: "CAB-C03",
    total_hours: 14,
    remark: "擅长沟通，协调能力强",
  },
];

export const Volunteers = () => {
  const columns: ColumnsType<Volunteer> = [
    {
      title: "志愿者姓名",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "值班日期",
      dataIndex: "shift_date",
      key: "shift_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "班次",
      dataIndex: "shift_time",
      key: "shift_time",
      render: (time: string) => (
        <Tag color={time === "上午" ? "blue" : "orange"}>
          {time}
        </Tag>
      ),
    },
    {
      title: "值班柜机",
      dataIndex: "cabinet_code",
      key: "cabinet_code",
      render: (code: string) => (
        <Tag color="cyan">{code}</Tag>
      ),
    },
    {
      title: "志愿次数",
      dataIndex: "total_hours",
      key: "total_hours",
      render: (hours: number) => (
        <span style={{ color: hours >= 10 ? "#52c41a" : "#999" }}>
          {hours} 次
        </span>
      ),
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      ellipsis: true,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>志愿者管理</h2>
      </div>
      <Table
        dataSource={demoVolunteers}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 位志愿者`,
        }}
      />
    </div>
  );
};
