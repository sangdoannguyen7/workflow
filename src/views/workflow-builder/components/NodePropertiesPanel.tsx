import React, { useCallback } from "react";
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
  theme,
} from "antd";
import {
  SettingOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  TagsOutlined,
  ClockCircleOutlined,
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
  trigger: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    fields: ["endpoint", "method", "headers", "authentication"],
  },
  behavior: {
    icon: <ApiOutlined />,
    color: "#1890ff",
    fields: ["url", "method", "headers", "payload", "timeout"],
  },
  output: {
    icon: <ScheduleOutlined />,
    color: "#fa8c16",
    fields: ["destination", "format", "options", "validation"],
  },
};

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  node,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [form] = Form.useForm();
  const {
    token: {
      colorBgContainer,
      colorPrimary,
      colorText,
      colorTextSecondary,
      borderRadiusLG,
      boxShadowSecondary,
    },
  } = theme.useToken();

  const handleSave = useCallback(() => {
    const values = form.getFieldsValue();
    if (node) {
      onUpdate(node.id, { ...node.data, ...values });
    }
  }, [form, node, onUpdate]);

  const handleFieldChange = useCallback(() => {
    // Auto-save on field change với debounce
    setTimeout(handleSave, 300);
  }, [handleSave]);

  if (!node) {
    return (
      <Card
        style={{
          position: "absolute",
          top: "80px",
          right: "20px",
          width: "360px",
          zIndex: 1000,
          borderRadius: borderRadiusLG,
          boxShadow: boxShadowSecondary,
          border: "1px solid #e8e8e8",
        }}
        title={
          <Space>
            <InfoCircleOutlined style={{ color: colorPrimary }} />
            <span>Properties Panel</span>
          </Space>
        }
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <SettingOutlined
            style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }}
          />
          <Text type="secondary" style={{ fontSize: "14px" }}>
            Chọn một node để xem và chỉnh sửa thuộc tính
          </Text>
        </div>
      </Card>
    );
  }

  const config =
    TEMPLATE_CONFIGS[node.data.templateType as keyof typeof TEMPLATE_CONFIGS] ||
    TEMPLATE_CONFIGS.behavior;

  const tabItems = [
    {
      key: "1",
      label: (
        <Space>
          <InfoCircleOutlined />
          Cơ bản
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {/* Node Identity */}
          <div
            style={{
              padding: "12px",
              background: `${config?.color}08`,
              borderRadius: "8px",
              border: `1px solid ${config?.color}20`,
            }}
          >
            <Text strong style={{ fontSize: "12px", color: colorText }}>
              Node Identity
            </Text>
            <div style={{ marginTop: "8px" }}>
              <Text strong>ID:</Text>{" "}
              <Text type="secondary" code style={{ fontSize: "11px" }}>
                {node.id}
              </Text>
            </div>
          </div>

          <Form.Item
            name="label"
            label="Tên Node"
            style={{ marginBottom: "16px" }}
          >
            <Input
              placeholder="Nhập tên node"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            style={{ marginBottom: "16px" }}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chức năng của node"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          {/* Template Info */}
          <div
            style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Text strong style={{ fontSize: "12px" }}>
                  Template:
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  {node.data.templateCode}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: "12px" }}>
                  Type:
                </Text>
                <br />
                <Tag color={config?.color} size="small" style={{ margin: 0 }}>
                  {node.data.templateType?.toUpperCase()}
                </Tag>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: "16px 0" }} />

          {/* Position Info */}
          <div
            style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <Text
              strong
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Vị trí trên canvas
            </Text>
            <Row gutter={12}>
              <Col span={12}>
                <Text style={{ fontSize: "11px" }}>
                  <strong>X:</strong> {Math.round(node.position.x)}px
                </Text>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "11px" }}>
                  <strong>Y:</strong> {Math.round(node.position.y)}px
                </Text>
              </Col>
            </Row>
          </div>
        </Space>
      ),
    },
    {
      key: "2",
      label: (
        <Space>
          <SettingOutlined />
          Cấu hình
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Form.Item
            name="timeout"
            label={
              <Space>
                <ClockCircleOutlined />
                Timeout (ms)
              </Space>
            }
          >
            <Input
              type="number"
              placeholder="30000"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="retries"
            label={
              <Space>
                <ThunderboltOutlined />
                Số lần thử lại
              </Space>
            }
          >
            <Input
              type="number"
              placeholder="3"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item name="priority" label="Độ ưu tiên">
            <Select
              placeholder="Chọn độ ưu tiên"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            >
              <Option value="low">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#52c41a",
                    }}
                  />
                  Thấp
                </Space>
              </Option>
              <Option value="normal">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#1890ff",
                    }}
                  />
                  Bình thường
                </Space>
              </Option>
              <Option value="high">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#fa8c16",
                    }}
                  />
                  Cao
                </Space>
              </Option>
              <Option value="critical">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#ff4d4f",
                    }}
                  />
                  Khẩn cấp
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="condition" label="Điều kiện thực thi">
            <TextArea
              rows={3}
              placeholder="if (data.status === 'active') { return true; }"
              onChange={handleFieldChange}
              style={{
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            />
          </Form.Item>

          <Form.Item name="errorHandling" label="Xử lý lỗi">
            <Select
              placeholder="Chọn cách xử lý lỗi"
              onChange={handleFieldChange}
            >
              <Option value="retry">
                <Space>
                  <ThunderboltOutlined style={{ color: "#1890ff" }} />
                  Thử lại
                </Space>
              </Option>
              <Option value="skip">
                <Space>
                  <InfoCircleOutlined style={{ color: "#52c41a" }} />
                  Bỏ qua
                </Space>
              </Option>
              <Option value="stop">
                <Space>
                  <DeleteOutlined style={{ color: "#ff4d4f" }} />
                  Dừng workflow
                </Space>
              </Option>
              <Option value="fallback">
                <Space>
                  <SettingOutlined style={{ color: "#fa8c16" }} />
                  Chuyển sang backup
                </Space>
              </Option>
            </Select>
          </Form.Item>
        </Space>
      ),
    },
    {
      key: "3",
      label: (
        <Space>
          <div style={{ color: config?.color }}>{config?.icon}</div>
          Template
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {/* Template-specific fields */}
          {config?.fields.map((field) => (
            <Form.Item
              key={field}
              name={field}
              label={
                <Space>
                  <div style={{ color: config?.color }}>{config?.icon}</div>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Space>
              }
            >
              <Input
                placeholder={`Nhập ${field}`}
                onChange={handleFieldChange}
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
          ))}

          <Divider />

          <Form.Item name="customConfig" label="Cấu hình tùy chỉnh (JSON)">
            <TextArea
              rows={5}
              placeholder='{\n  "key": "value",\n  "timeout": 5000\n}'
              onChange={handleFieldChange}
              style={{
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            />
          </Form.Item>

          {/* Template Info */}
          <div
            style={{
              padding: "12px",
              background: `${config?.color}08`,
              borderRadius: "8px",
              border: `1px solid ${config?.color}20`,
            }}
          >
            <Text strong style={{ fontSize: "12px", color: config?.color }}>
              Template Information
            </Text>
            <div style={{ marginTop: "8px", fontSize: "11px" }}>
              <div>
                <strong>Agent:</strong> {node.data.agentCode}
              </div>
              <div>
                <strong>Type:</strong> {node.data.templateType}
              </div>
              <div>
                <strong>Code:</strong> {node.data.templateCode}
              </div>
            </div>
          </div>
        </Space>
      ),
    },
    {
      key: "4",
      label: (
        <Space>
          <TagsOutlined />
          Metadata
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Form.Item
            name="tags"
            label={
              <Space>
                <TagsOutlined />
                Tags
              </Space>
            }
          >
            <Select
              mode="tags"
              placeholder="Thêm tags để phân loại"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            >
              <Option value="production">
                <Tag color="green">Production</Tag>
              </Option>
              <Option value="testing">
                <Tag color="blue">Testing</Tag>
              </Option>
              <Option value="critical">
                <Tag color="red">Critical</Tag>
              </Option>
              <Option value="deprecated">
                <Tag color="orange">Deprecated</Tag>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="version" label="Version">
            <Input
              placeholder="1.0.0"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item name="author" label="Tác giả">
            <Input
              placeholder="Nhập tên tác giả"
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item name="environment" label="Environment">
            <Select placeholder="Chọn environment" onChange={handleFieldChange}>
              <Option value="development">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#1890ff",
                    }}
                  />
                  Development
                </Space>
              </Option>
              <Option value="staging">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#fa8c16",
                    }}
                  />
                  Staging
                </Space>
              </Option>
              <Option value="production">
                <Space>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#52c41a",
                    }}
                  />
                  Production
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="lastModified" label="Sửa đổi lần cuối">
            <Input
              disabled
              value={new Date().toLocaleString("vi-VN")}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={4}
              placeholder="Ghi chú về node này..."
              onChange={handleFieldChange}
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          {/* Metadata Summary */}
          <div
            style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <Text strong style={{ fontSize: "12px" }}>
              Node Statistics
            </Text>
            <div style={{ marginTop: "8px", fontSize: "11px" }}>
              <Row gutter={12}>
                <Col span={12}>
                  <div>
                    <strong>Created:</strong> Just now
                  </div>
                  <div>
                    <strong>Connections:</strong> 0
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <strong>Status:</strong> Active
                  </div>
                  <div>
                    <strong>Executions:</strong> 0
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        position: "absolute",
        top: "80px",
        right: "20px",
        width: "400px",
        maxHeight: "85vh",
        overflow: "hidden",
        zIndex: 1000,
        borderRadius: borderRadiusLG,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        border: "1px solid #e8e8e8",
      }}
      title={
        <Space>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${config?.color}, ${config?.color}cc)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {config?.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>
              Node Properties
            </div>
            <div
              style={{
                fontSize: "12px",
                color: colorTextSecondary,
                fontWeight: 400,
              }}
            >
              {node.data.label}
            </div>
          </div>
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
            style={{ borderRadius: "6px" }}
          />
          <Button
            type="text"
            onClick={onClose}
            size="small"
            style={{ borderRadius: "6px" }}
          >
            ✕
          </Button>
        </Space>
      }
      bodyStyle={{
        padding: 0,
        height: "calc(100% - 64px)",
        overflow: "hidden",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={node.data}
        size="small"
        style={{ height: "100%" }}
      >
        <Tabs
          defaultActiveKey="1"
          size="small"
          items={tabItems}
          style={{
            height: "100%",
            "& .ant-tabs-content-holder": {
              overflow: "auto",
              maxHeight: "calc(100vh - 200px)",
            },
          }}
          tabBarStyle={{
            paddingLeft: "16px",
            paddingRight: "16px",
            marginBottom: 0,
            borderBottom: "1px solid #f0f0f0",
          }}
        />

        {/* Tab content area with proper scrolling */}
        <div
          style={{
            padding: "16px",
            height: "calc(100% - 48px)",
            overflow: "auto",
          }}
        >
          {/* Content is handled by Tabs component */}
        </div>
      </Form>
    </Card>
  );
};

export default NodePropertiesPanel;
