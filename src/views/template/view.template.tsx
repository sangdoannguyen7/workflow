import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Row,
  Col,
  Typography,
  Popconfirm,
  Drawer,
  Descriptions,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import templateApi from "../../apis/template/api.template";
import agentApi from "../../apis/agent/api.agent";
import { ITemplate } from "../../interface/template.interface";
import { IAgent } from "../../interface/agent.interface";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const TemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ITemplate | null>(
    null
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // Get template type icon
  const getTemplateIcon = (templateType: string) => {
    switch (templateType) {
      case "trigger":
        return <LinkOutlined style={{ color: "#52c41a" }} />;
      case "behavior":
        return <ApiOutlined style={{ color: "#1890ff" }} />;
      case "output":
        return <ScheduleOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  // Get template type color
  const getTemplateColor = (templateType: string) => {
    switch (templateType) {
      case "trigger":
        return "green";
      case "behavior":
        return "blue";
      case "output":
        return "orange";
      default:
        return "default";
    }
  };

  // Load templates
  const loadTemplates = async (params?: any) => {
    setLoading(true);
    try {
      const response = await templateApi.getTemplates({
        ...params,
        search: searchText,
        statusCode: statusFilter,
        templateType: typeFilter,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      setTemplates(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách template");
    } finally {
      setLoading(false);
    }
  };

  // Load agents
  const loadAgents = async () => {
    try {
      const response = await agentApi.getAgents({ size: 1000 });
      setAgents(response.content);
    } catch (error) {
      message.error("Không thể tải danh sách agent");
    }
  };

  // Handle create/update template
  const handleSave = async (values: any) => {
    try {
      const templateData = {
        ...values,
        search:
          `${values.templateName} ${values.description} ${values.templateType}`.toLowerCase(),
      };

      if (editingTemplate) {
        await templateApi.updateTemplate(
          editingTemplate.templateCode,
          templateData
        );
        message.success("Cập nhật template thành công");
      } else {
        await templateApi.createTemplate(templateData);
        message.success("Tạo template thành công");
      }

      setIsModalVisible(false);
      setEditingTemplate(null);
      form.resetFields();
      loadTemplates();
    } catch (error) {
      message.error("Lỗi khi lưu template");
    }
  };

  // Handle delete template
  const handleDelete = async (templateCode: string) => {
    try {
      await templateApi.deleteTemplate(templateCode);
      message.success("Xóa template thành công");
      loadTemplates();
    } catch (error) {
      message.error("Lỗi khi xóa template");
    }
  };

  // Show create modal
  const showCreateModal = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show edit modal
  const showEditModal = (template: ITemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setIsModalVisible(true);
  };

  // Show detail drawer
  const showDetail = (template: ITemplate) => {
    setSelectedTemplate(template);
    setIsDetailVisible(true);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "type") {
      setTypeFilter(value);
    }
    setPagination({ ...pagination, current: 1 });
  };

  // Handle table change
  const handleTableChange = (paginationInfo: any) => {
    setPagination({
      ...pagination,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    });
  };

  // Table columns
  const columns: ColumnsType<ITemplate> = [
    {
      title: "Template Code",
      dataIndex: "templateCode",
      key: "templateCode",
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: "Tên Template",
      dataIndex: "templateName",
      key: "templateName",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {getTemplateIcon(record.templateType)}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "templateType",
      key: "templateType",
      width: 120,
      render: (type) => (
        <Tag color={getTemplateColor(type)}>{type?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Agent",
      dataIndex: "agentName",
      key: "agentName",
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 12 }}>
            {text}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.agentCode}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCode",
      key: "statusCode",
      width: 120,
      render: (status, record) => {
        const color =
          status === "ACTIVE"
            ? "green"
            : status === "INACTIVE"
            ? "red"
            : "orange";
        return <Tag color={color}>{record.statusName}</Tag>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => text || <Text type="secondary">Chưa có mô tả</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa template này?"
            onConfirm={() => handleDelete(record.templateCode)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Xóa" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    loadTemplates();
  }, [
    searchText,
    statusFilter,
    typeFilter,
    pagination.current,
    pagination.pageSize,
  ]);

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              <FileTextOutlined /> Quản lý Template
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Tạo Template
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm template..."
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo loại"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("type", value)}
            >
              <Option value="">Tất cả loại</Option>
              <Option value="trigger">Trigger</Option>
              <Option value="behavior">Behavior</Option>
              <Option value="output">Output</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("status", value)}
            >
              <Option value="">Tất cả trạng thái</Option>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Không hoạt động</Option>
              <Option value="DRAFT">Bản nháp</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button icon={<ReloadOutlined />} onClick={() => loadTemplates()}>
              Làm mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={templates}
          rowKey="templateCode"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} template`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingTemplate ? "Chỉnh sửa Template" : "Tạo Template mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTemplate(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            statusCode: "DRAFT",
            statusName: "Bản nháp",
            templateType: "behavior",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="templateCode"
                label="Template Code"
                rules={[
                  { required: true, message: "Vui lòng nhập template code" },
                ]}
              >
                <Input
                  placeholder="VD: WEBHOOK_RECEIVE"
                  disabled={!!editingTemplate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="templateName"
                label="Tên Template"
                rules={[
                  { required: true, message: "Vui lòng nhập tên template" },
                ]}
              >
                <Input placeholder="VD: Webhook Receiver" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="templateType"
                label="Loại Template"
                rules={[
                  { required: true, message: "Vui lòng chọn loại template" },
                ]}
              >
                <Select>
                  <Option value="trigger">🚀 Trigger (Chỉ output)</Option>
                  <Option value="behavior">⚙️ Behavior (Input & Output)</Option>
                  <Option value="output">📤 Output (Chỉ input)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="statusCode"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Select>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Không hoạt động</Option>
                  <Option value="DRAFT">Bản nháp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="statusName"
                label="Tên trạng thái"
                rules={[
                  { required: true, message: "Vui lòng nhập tên trạng thái" },
                ]}
              >
                <Input placeholder="VD: Hoạt động" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="agentCode"
                label="Agent"
                rules={[{ required: true, message: "Vui lòng chọn agent" }]}
              >
                <Select placeholder="Chọn agent">
                  {agents.map((agent) => (
                    <Option key={agent.agentCode} value={agent.agentCode}>
                      {agent.agentName} ({agent.agentCode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="agentName"
                label="Tên Agent"
                rules={[{ required: true, message: "Vui lòng nhập tên agent" }]}
              >
                <Input placeholder="VD: Webhook Processing Agent" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả chi tiết về template..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="schema" label="Schema (JSON)">
                <TextArea
                  rows={4}
                  placeholder='{"type": "object", "properties": {...}}'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="body" label="Body Template (JSON)">
                <TextArea
                  rows={4}
                  placeholder='{"data": "{{input}}", "action": "process"}'
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rule" label="Rules (JSON)">
                <TextArea
                  rows={3}
                  placeholder='{"validation": ["required"], "timeout": 30000}'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="configuration" label="Configuration (JSON)">
                <TextArea
                  rows={3}
                  placeholder='{"retry": 3, "timeout": 5000}'
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTemplate ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingTemplate(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        title="Chi tiết Template"
        placement="right"
        width={600}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedTemplate && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="Template Code">
                <Text code>{selectedTemplate.templateCode}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Template">
                <Space>
                  {getTemplateIcon(selectedTemplate.templateType)}
                  <Text strong>{selectedTemplate.templateName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Loại">
                <Tag color={getTemplateColor(selectedTemplate.templateType)}>
                  {selectedTemplate.templateType?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Agent">
                <div>
                  <Text strong>{selectedTemplate.agentName}</Text>
                  <br />
                  <Text type="secondary">{selectedTemplate.agentCode}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedTemplate.statusCode === "ACTIVE"
                      ? "green"
                      : "orange"
                  }
                >
                  {selectedTemplate.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedTemplate.description || (
                  <Text type="secondary">Chưa có mô tả</Text>
                )}
              </Descriptions.Item>
            </Descriptions>

            {selectedTemplate.schema && (
              <Card title="Schema" size="small">
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 8,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {JSON.stringify(
                    JSON.parse(selectedTemplate.schema || "{}"),
                    null,
                    2
                  )}
                </pre>
              </Card>
            )}

            {selectedTemplate.body && (
              <Card title="Body Template" size="small">
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 8,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {JSON.stringify(
                    JSON.parse(selectedTemplate.body || "{}"),
                    null,
                    2
                  )}
                </pre>
              </Card>
            )}

            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsDetailVisible(false);
                  showEditModal(selectedTemplate);
                }}
              >
                Chỉnh sửa
              </Button>
            </Space>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default TemplatePage;
