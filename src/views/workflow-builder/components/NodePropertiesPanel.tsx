import React from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Tabs,
  Space,
  Typography,
  Tag,
  Button,
  Divider,
} from "antd";
import {
  SettingOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Node } from "@xyflow/react";

const { Option } = Select;
const { Text, Title } = Typography;
const { TextArea } = Input;

interface NodePropertiesPanelProps {
  node: Node | null;
  onUpdate: (nodeId: string, data: any) => void;
  onDelete: () => void;
  onClose: () => void;
}

const TEMPLATE_CONFIGS = {
  webhook: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    fields: ["endpoint", "method", "headers", "authentication"],
  },
  schedule: {
    icon: <ScheduleOutlined />,
    color: "#1890ff",
    fields: ["cron", "timezone", "frequency", "maxExecutions"],
  },
  restapi: {
    icon: <ApiOutlined />,
    color: "#fa8c16",
    fields: ["url", "method", "headers", "payload", "timeout"],
  },
};

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  node,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [form] = Form.useForm();

  if (!node) {
    return (
      <Card
        style={{
          position: "absolute",
          top: "80px",
          right: "20px",
          width: "350px",
          zIndex: 1000,
        }}
        title="Properties"
      >
        <Text type="secondary">Chọn một node để xem thuộc tính</Text>
      </Card>
    );
  }

  const config =
    TEMPLATE_CONFIGS[node.data.templateType as keyof typeof TEMPLATE_CONFIGS];

  const handleSave = () => {
    const values = form.getFieldsValue();
    onUpdate(node.id, { ...node.data, ...values });
  };

  return (
    <Card
      style={{
        position: "absolute",
        top: "80px",
        right: "20px",
        width: "380px",
        maxHeight: "80vh",
        overflow: "auto",
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
      title={
        <Space>
          <div style={{ color: config?.color }}>{config?.icon}</div>
          Node Properties
        </Space>
      }
      extra={
        <Space>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={onDelete}
            danger
            size="small"
          />
          <Button type="text" onClick={onClose} size="small">
            ×
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={node.data}
        size="small"
      >
        <Tabs
          defaultActiveKey="1"
          size="small"
          items={[
            {
              key: "1",
              label: "Cơ bản",
              children: (
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>ID:</Text> <Text type="secondary">{node.id}</Text>
              </div>

              <Form.Item name="label" label="Tên Node">
                <Input placeholder="Nhập tên node" onChange={handleSave} />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <TextArea
                  rows={2}
                  placeholder="Mô tả chức năng của node"
                  onChange={handleSave}
                />
              </Form.Item>

              <Row gutter={8}>
                <Col span={12}>
                  <Text strong>Template:</Text>
                  <br />
                  <Text type="secondary">{node.data.templateCode}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Type:</Text>
                  <br />
                  <Tag color={config?.color}>
                    {node.data.templateType?.toUpperCase()}
                  </Tag>
                </Col>
              </Row>

              <Divider style={{ margin: "12px 0" }} />

              <Row gutter={8}>
                <Col span={12}>
                  <Text strong>X:</Text> {Math.round(node.position.x)}
                </Col>
                <Col span={12}>
                  <Text strong>Y:</Text> {Math.round(node.position.y)}
                </Col>
              </Row>
            </Space>
          </TabPane>

          <TabPane tab="Cấu hình" key="2">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item name="timeout" label="Timeout (ms)">
                <Input
                  type="number"
                  placeholder="30000"
                  onChange={handleSave}
                />
              </Form.Item>

              <Form.Item name="retries" label="Số lần thử lại">
                <Input type="number" placeholder="3" onChange={handleSave} />
              </Form.Item>

              <Form.Item name="priority" label="Độ ưu tiên">
                <Select placeholder="Chọn độ ưu tiên" onChange={handleSave}>
                  <Option value="low">Thấp</Option>
                  <Option value="normal">Bình thường</Option>
                  <Option value="high">Cao</Option>
                  <Option value="critical">Khẩn cấp</Option>
                </Select>
              </Form.Item>

              <Form.Item name="condition" label="Điều kiện">
                <TextArea
                  rows={2}
                  placeholder="if (data.status === 'active') { return true; }"
                  onChange={handleSave}
                />
              </Form.Item>

              <Form.Item name="errorHandling" label="Xử lý lỗi">
                <Select placeholder="Chọn cách xử lý lỗi" onChange={handleSave}>
                  <Option value="retry">Thử lại</Option>
                  <Option value="skip">Bỏ qua</Option>
                  <Option value="stop">Dừng workflow</Option>
                  <Option value="fallback">Chuyển sang backup</Option>
                </Select>
              </Form.Item>
            </Space>
          </TabPane>

          <TabPane tab="Template" key="3">
            <Space direction="vertical" style={{ width: "100%" }}>
              {config?.fields.map((field) => (
                <Form.Item
                  key={field}
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                >
                  <Input placeholder={`Nhập ${field}`} onChange={handleSave} />
                </Form.Item>
              ))}

              <Form.Item name="customConfig" label="Cấu hình tùy chỉnh">
                <TextArea
                  rows={4}
                  placeholder='{ "key": "value" }'
                  onChange={handleSave}
                />
              </Form.Item>
            </Space>
          </TabPane>

          <TabPane tab="Metadata" key="4">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Thêm tags"
                  onChange={handleSave}
                >
                  <Option value="production">Production</Option>
                  <Option value="testing">Testing</Option>
                  <Option value="critical">Critical</Option>
                  <Option value="deprecated">Deprecated</Option>
                </Select>
              </Form.Item>

              <Form.Item name="version" label="Version">
                <Input placeholder="1.0.0" onChange={handleSave} />
              </Form.Item>

              <Form.Item name="author" label="Tác giả">
                <Input placeholder="Nhập tên tác giả" onChange={handleSave} />
              </Form.Item>

              <Form.Item name="lastModified" label="Sửa đổi lần cuối">
                <Input disabled value={new Date().toLocaleString()} />
              </Form.Item>

              <Form.Item name="notes" label="Ghi chú">
                <TextArea
                  rows={3}
                  placeholder="Ghi chú về node này..."
                  onChange={handleSave}
                />
              </Form.Item>
            </Space>
          </TabPane>
        </Tabs>
      </Form>
    </Card>
  );
};

export default NodePropertiesPanel;