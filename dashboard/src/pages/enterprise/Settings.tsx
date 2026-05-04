import { Card, Form, Input, Button, Switch, Space } from "antd";

export const EnterpriseSettings = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Settings saved:", values);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1E293B' }}>
        系统设置
      </h2>
      <Card
        style={{ borderRadius: '12px', maxWidth: '600px' }}
        styles={{ body: { padding: '24px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            merchantName: "",
            contactPerson: "",
            contactPhone: "",
            enableNotifications: true,
          }}
        >
          <Form.Item label="商户名称" name="merchantName">
            <Input style={{ borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item label="联系人" name="contactPerson">
            <Input style={{ borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item label="联系电话" name="contactPhone">
            <Input style={{ borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item label="启用通知" name="enableNotifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item style={{ marginTop: '24px' }}>
            <Space>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
              <Button>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
