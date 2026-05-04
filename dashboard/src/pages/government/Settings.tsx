import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Switch, Space, Table, Modal, Select, message, Popconfirm, Tag, Alert } from "antd";
import { Plus, Trash2, Pencil, Phone } from "lucide-react";
import { insforge } from "../../providers/insforge";
import { TOKEN_KEY } from "../../providers/constants";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  api_url: string;
  api_key: string;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const AI_PROVIDERS = [
  { value: "deepseek", label: "DeepSeek" },
  { value: "kimi", label: "Kimi" },
  { value: "minimax", label: "MiniMax" },
  { value: "qwen", label: "Qwen（通义千问）" },
  { value: "doubao", label: "豆包" },
  { value: "zhipu", label: "智谱AI" },
  { value: "siliconflow", label: "硅基流动" },
];

const PRESET_MODELS: Record<string, { label: string; value: string }[]> = {
  deepseek: [
    { label: "DeepSeek-V2.5", value: "deepseek-ai/DeepSeek-V2.5" },
    { label: "DeepSeek-V3", value: "deepseek-ai/DeepSeek-V3" },
    { label: "DeepSeek-R1", value: "deepseek-ai/DeepSeek-R1" },
  ],
  kimi: [
    { label: "Kimi-K2-Instruct", value: "moonshotai/Kimi-K2-Instruct" },
    { label: "Kimi-k1.5", value: "moonshotai/k1.5" },
  ],
  minimax: [
    { label: "MiniMax-Text-01", value: "MiniMaxLab/MiniMax-Text-01" },
  ],
  qwen: [
    { label: "QwQ-32B", value: "Qwen/QwQ-32B" },
    { label: "Qwen2.5-72B", value: "Qwen/Qwen2.5-72B-Instruct" },
    { label: "Qwen2.5-Coder-32B", value: "Qwen/Qwen2.5-Coder-32B-Instruct" },
    { label: "Qwen2.5-Math-72B", value: "Qwen/Qwen2.5-Math-72B-Instruct" },
  ],
  doubao: [
    { label: "Doubao-pro-32k", value: "doubao-pro-32k" },
    { label: "Doubao-o1-32k", value: "doubao-o1-32k" },
  ],
  zhipu: [
    { label: "GLM-4-Flash", value: "THUDM/GLM-4-Flash" },
    { label: "GLM-4V-Flash", value: "THUDM/GLM-4V-Flash" },
  ],
  siliconflow: [
    { label: "DeepSeek-V2.5", value: "deepseek-ai/DeepSeek-V2.5" },
    { label: "Qwen2.5-72B", value: "Qwen/Qwen2.5-72B-Instruct" },
    { label: "GLM-4-Flash", value: "THUDM/GLM-4-Flash" },
    { label: "Yi-1.5-34B", value: "01-ai/Yi-1.5-34B-Chat" },
    { label: "BGE-嵌入", value: "BAAI/bge-large-zh-v1.5" },
  ],
};

interface UserInfo {
  id: string;
  phone: string;
  name: string;
  user_type: string;
}

export const Settings = () => {
  const [form] = Form.useForm();
  const [aiForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from("ai_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error("获取AI模型列表失败:", error);
      message.error("获取AI模型列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const user = JSON.parse(token);
      setCurrentUser(user);
      phoneForm.setFieldsValue({ phone: user.phone });
    }
  };

  const handleUpdatePhone = async (values: { phone: string }) => {
    if (!currentUser) return;

    setPhoneLoading(true);
    try {
      const { error } = await insforge.database
        .from("users")
        .update({ phone: values.phone, updated_at: new Date().toISOString() })
        .eq("id", currentUser.id);

      if (error) throw error;

      const updatedUser = { ...currentUser, phone: values.phone };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      message.success("手机号修改成功");
    } catch (error) {
      console.error("修改手机号失败:", error);
      message.error("修改手机号失败，请检查手机号是否已被使用");
    } finally {
      setPhoneLoading(false);
    }
  };

  const onFinish = (values: any) => {
    console.log("Settings saved:", values);
    message.success("系统设置已保存");
  };

  const handleAddModel = async (values: any) => {
    try {
      if (values.is_active) {
        await insforge.database
          .from("ai_models")
          .update({ is_active: false })
          .eq("is_active", true);
      }

      const { data, error } = await insforge.database
        .from("ai_models")
        .insert([{
          name: values.name,
          provider: values.provider,
          model_id: values.model_id,
          api_url: values.api_url,
          api_key: values.api_key,
          is_active: values.is_active || false,
          description: values.description || null,
        }]);

      if (error) throw error;
      message.success("AI模型添加成功");
      setModalVisible(false);
      aiForm.resetFields();
      setSelectedProvider("");
      fetchModels();
    } catch (error) {
      console.error("添加AI模型失败:", error);
      message.error("添加AI模型失败");
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      const { error } = await insforge.database
        .from("ai_models")
        .delete()
        .eq("id", id);

      if (error) throw error;
      message.success("AI模型删除成功");
      fetchModels();
    } catch (error) {
      console.error("删除AI模型失败:", error);
      message.error("删除AI模型失败");
    }
  };

  const handleSetActive = async (id: string, currentActive: boolean) => {
    if (currentActive) return;

    try {
      await insforge.database
        .from("ai_models")
        .update({ is_active: false })
        .eq("is_active", true);

      const { error } = await insforge.database
        .from("ai_models")
        .update({ is_active: true })
        .eq("id", id);

      if (error) throw error;
      message.success("已设置为当前使用模型");
      fetchModels();
    } catch (error) {
      console.error("设置启用模型失败:", error);
      message.error("设置启用模型失败");
    }
  };

  const openEditModal = (record: AIModel) => {
    setEditingModel(record);
    setSelectedProvider(record.provider);
    aiForm.setFieldsValue({
      name: record.name,
      provider: record.provider,
      model_id: record.model_id,
      api_url: record.api_url,
      api_key: record.api_key,
      is_active: record.is_active,
      description: record.description,
    });
    setModalVisible(true);
  };

  const handleUpdateModel = async (values: any) => {
    if (!editingModel) return;

    try {
      if (values.is_active) {
        await insforge.database
          .from("ai_models")
          .update({ is_active: false })
          .eq("is_active", true);
      }

      const { error } = await insforge.database
        .from("ai_models")
        .update({
          name: values.name,
          provider: values.provider,
          model_id: values.model_id,
          api_url: values.api_url,
          api_key: values.api_key,
          is_active: values.is_active || false,
          description: values.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingModel.id);

      if (error) throw error;
      message.success("AI模型更新成功");
      setModalVisible(false);
      aiForm.resetFields();
      setEditingModel(null);
      setSelectedProvider("");
      fetchModels();
    } catch (error) {
      console.error("更新AI模型失败:", error);
      message.error("更新AI模型失败");
    }
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    aiForm.setFieldValue("model_id", "");
  };

  const columns = [
    {
      title: "模型名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "厂商",
      dataIndex: "provider",
      key: "provider",
      render: (provider: string) => {
        const found = AI_PROVIDERS.find(p => p.value === provider);
        return found?.label || provider;
      },
    },
    {
      title: "模型标识符",
      dataIndex: "model_id",
      key: "model_id",
      ellipsis: true,
    },
    {
      title: "调用链接",
      dataIndex: "api_url",
      key: "api_url",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "使用中" : "未启用"}
        </Tag>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: AIModel) => (
        <Space size="small">
          <Button
            type="link"
            icon={<Pencil size={14} />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          {!record.is_active && (
            <Button
              type="link"
              onClick={() => handleSetActive(record.id, record.is_active)}
            >
              设为使用
            </Button>
          )}
          <Popconfirm
            title="确定删除此模型？"
            onConfirm={() => handleDeleteModel(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<Trash2 size={14} />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">系统设置</h2>

      <div className="space-y-6">
        <Card title="手机号配置" className="max-w-2xl">
          <Alert
            message="提示"
            description="请配置您的手机号，在出现重要异常时系统会自动通知您"
            type="info"
            showIcon
            className="mb-4"
          />
          <Form
            form={phoneForm}
            layout="vertical"
            onFinish={handleUpdatePhone}
          >
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: "请输入手机号" },
                { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" }
              ]}
            >
              <Input prefix={<Phone size={16} />} placeholder="请输入手机号" maxLength={11} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={phoneLoading}>
                确认修改
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="基础设置" className="max-w-2xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              systemName: "扬名街道公益柜机系统",
              contactEmail: "admin@example.com",
              enableNotifications: true,
            }}
          >
            <Form.Item label="系统名称" name="systemName">
              <Input />
            </Form.Item>
            <Form.Item label="联系邮箱" name="contactEmail">
              <Input type="email" />
            </Form.Item>
            <Form.Item label="启用通知" name="enableNotifications" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存设置
                </Button>
                <Button>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="人工智能接口配置"
          extra={
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => {
                setEditingModel(null);
                aiForm.resetFields();
                setSelectedProvider("");
                setModalVisible(true);
              }}
            >
              添加模型
            </Button>
          }
          className="max-w-5xl"
        >
          <div className="mb-4 text-gray-600">
            <p>配置AI模型接口，用于提供项目优化建议和为老人提供使用帮助。支持硅基流动等平台。</p>
          </div>
          <Table
            columns={columns}
            dataSource={models}
            rowKey="id"
            loading={loading}
            pagination={false}
            locale={{ emptyText: "暂无已配置的AI模型" }}
          />
        </Card>
      </div>

      <Modal
        title={editingModel ? "编辑AI模型" : "添加AI模型"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          aiForm.resetFields();
          setEditingModel(null);
          setSelectedProvider("");
        }}
        footer={null}
        width={550}
      >
        <Form
          form={aiForm}
          layout="vertical"
          onFinish={editingModel ? handleUpdateModel : handleAddModel}
          initialValues={{
            is_active: false,
          }}
        >
          <Form.Item
            label="自定义名称"
            name="name"
            rules={[{ required: true, message: "请输入模型名称" }]}
          >
            <Input placeholder="例如：项目优化助手" />
          </Form.Item>

          <Form.Item
            label="模型厂商"
            name="provider"
            rules={[{ required: true, message: "请选择模型厂商" }]}
          >
            <Select
              placeholder="请选择模型厂商"
              options={AI_PROVIDERS}
              onChange={handleProviderChange}
            />
          </Form.Item>

          <Form.Item
            label="模型标识符"
            name="model_id"
            rules={[{ required: true, message: "请输入模型标识符" }]}
            extra={
              selectedProvider && PRESET_MODELS[selectedProvider] ? (
                <div className="mt-2">
                  <span className="text-gray-500 text-xs">快速选择：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESET_MODELS[selectedProvider].map((model) => (
                      <Button
                        key={model.value}
                        size="small"
                        type="dashed"
                        onClick={() => aiForm.setFieldValue("model_id", model.value)}
                      >
                        {model.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null
            }
          >
            <Input placeholder="如：deepseek-ai/DeepSeek-V2.5" />
          </Form.Item>

          <Form.Item
            label="模型调用链接"
            name="api_url"
            rules={[
              { required: true, message: "请输入模型调用链接" },
              { type: "url", message: "请输入有效的URL地址" }
            ]}
          >
            <Input placeholder="https://api.siliconflow.cn/v1/chat/completions" />
          </Form.Item>

          <Form.Item
            label="API密钥"
            name="api_key"
            rules={[{ required: true, message: "请输入API密钥" }]}
          >
            <Input.Password placeholder="请输入API密钥" />
          </Form.Item>

          <Form.Item
            label="设为使用"
            name="is_active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="描述（可选）" name="description">
            <Input.TextArea rows={3} placeholder="请输入模型描述或用途说明" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                {editingModel ? "更新" : "添加"}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                aiForm.resetFields();
                setEditingModel(null);
                setSelectedProvider("");
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};