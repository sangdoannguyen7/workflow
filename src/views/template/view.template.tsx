import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Tag,
  theme,
  Tabs,
  Collapse,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  CodeOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  RobotOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import type { ActionType } from "@ant-design/pro-components";
import {
  ITemplate,
  ITemplateSearchParams,
  ITemplateRequest,
} from "../../interface/template.interface";
import { IAgent } from "../../interface/agent.interface";
import templateApi from "../../apis/template/api.template";
import agentApi from "../../apis/agent/api.agent";
import { NotificationComponent } from "../../shared/components/notification/notification";

const { Search, TextArea } = Input;
const { Panel } = Collapse;
const { Text } = Typography;

const TemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ITemplate | null>(
    null
  );
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchText, setSearchText] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const actionRef = useRef<ActionType>();

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorPrimary,
      colorTextSecondary,
    },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "INACTIVE", label: "Inactive", color: "red" },
    { value: "DRAFT", label: "Draft", color: "orange" },
  ];

  const typeOptions = [
    {
      value: "webhook",
      label: "Webhook",
      icon: <LinkOutlined />,
      color: "#52c41a",
    },
    {
      value: "schedule",
      label: "Schedule",
      icon: <ScheduleOutlined />,
      color: "#1890ff",
    },
    {
      value: "restapi",
      label: "REST API",
      icon: <ApiOutlined />,
      color: "#fa8c16",
    },
    {
      value: "process",
      label: "Process",
      icon: <SettingOutlined />,
      color: "#722ed1",
    },
  ];

  const getTypeConfig = (type: string) => {
    return typeOptions.find((opt) => opt.value === type) || typeOptions[0];
  };

  const fetchTemplates = async (params?: ITemplateSearchParams) => {
    try {
      const response = await templateApi.getTemplates({
        current: 1,
        pageSize: 1000,
        ...params,
      });

      if (response.success && response.data) {
        setTemplates(response.data);
        return {
          data: response.data,
          success: true,
          total: response.total,
        };
      } else {
        setTemplates([]);
        return {
          data: [],
          success: false,
          total: 0,
        };
      }
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tải danh sách template",
      });
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await agentApi.getAgents({ pageSize: 1000 });
      if (response.success && response.data) {
        setAgents(response.data);
      }
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tải danh sách agent",
      });
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreate = () => {
    setEditingTemplate(null);
    form.resetFields();
    form.setFieldsValue({
      statusCode: "ACTIVE",
      statusName: "Active",
    });
    setModalVisible(true);
  };

  const handleEdit = (template: ITemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      ...template,
      typeCode: template.typeCode || "",
      typeName: template.typeName || "",
      workflowCode: template.workflowCode || "",
      workflowName: template.workflowName || "",
      description: template.description || "",
      metadata: template.metadata || "",
      info: template.info || "",
      schema: template.schema || "",
      body: template.body || "",
      rule: template.rule || "",
      configuration: template.configuration || "",
      outputCode: template.outputCode || "",
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const selectedAgent = agents.find(
        (a) => a.agentCode === values.agentCode
      );
      const templateRequest: ITemplateRequest = {
        templateName: values.templateName,
        typeCode: values.typeCode || "",
        typeName: values.typeName || "",
        agentCode: values.agentCode,
        agentName: selectedAgent?.agentName || "",
        workflowCode: values.workflowCode || "",
        workflowName: values.workflowName || "",
        statusCode: values.statusCode,
        statusName:
          statusOptions.find((s) => s.value === values.statusCode)?.label || "",
        description: values.description || "",
        search:
          `${values.templateName} ${values.agentCode} ${values.typeCode}`.toLowerCase(),
        metadata: values.metadata || "",
        info: values.info || "",
        schema: values.schema || "",
        body: values.body || "",
        rule: values.rule || "",
        configuration: values.configuration || "",
        outputCode: values.outputCode || "",
      };

      if (editingTemplate) {
        await templateApi.updateTemplate(
          editingTemplate.templateCode,
          templateRequest
        );
        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: "Cập nhật template thành công",
        });
      } else {
        await templateApi.createTemplate(templateRequest);
        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: "Tạo template thành công",
        });
      }

      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể lưu template",
      });
    }
  };

  const columns: ProColumns<ITemplate>[] = [
    {
      title: "Template Code",
      dataIndex: "templateCode",
      key: "templateCode",
      width: 150,
      fixed: "left",
      copyable: true,
    },
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "typeCode",
      key: "typeCode",
      width: 120,
      render: (typeCode: string) => {
        const config = getTypeConfig(typeCode);
        return (
          <Tag
            icon={config.icon}
            color={config.color}
            style={{ fontWeight: 500 }}
          >
            {config.label}
          </Tag>
        );
      },
      filters: typeOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.typeCode === value,
    },
    {
      title: "Agent",
      dataIndex: "agentName",
      key: "agentName",
      width: 150,
      render: (text: string, record) => (
        <Space>
          <Avatar size="small" icon={<RobotOutlined />} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{text || "N/A"}</div>
            <div style={{ fontSize: 11, color: colorTextSecondary }}>
              {record.agentCode}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusCode",
      key: "statusCode",
      width: 100,
      render: (statusCode: string) => {
        const status = statusOptions.find((s) => s.value === statusCode);
        return status ? (
          <Tag color={status.color} style={{ fontWeight: 500 }}>
            {status.label}
          </Tag>
        ) : (
          <Tag>{statusCode}</Tag>
        );
      },
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.statusCode === value,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) =>
        text || <Text type="secondary">Không có mô tả</Text>,
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: any, record: ITemplate) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Group templates by agent
  const groupedTemplates = (templates || []).reduce((acc, template) => {
    const agentCode = template.agentCode || "unknown";
    if (!acc[agentCode]) {
      acc[agentCode] = [];
    }
    acc[agentCode].push(template);
    return acc;
  }, {} as Record<string, ITemplate[]>);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      !searchText ||
      template.templateName?.toLowerCase().includes(searchText.toLowerCase()) ||
      template.templateCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchesAgent = !selectedAgent || template.agentCode === selectedAgent;

    return matchesSearch && matchesAgent;
  });

  const renderCardView = () => {
    const agentGroups = Object.entries(groupedTemplates)
      .filter(([agentCode]) => !selectedAgent || agentCode === selectedAgent)
      .map(([agentCode, agentTemplates]) => {
        const agent = agents.find((a) => a.agentCode === agentCode);
        const filteredAgentTemplates = agentTemplates.filter(
          (template) =>
            !searchText ||
            template.templateName
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            template.templateCode
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            template.description
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
        );

        if (filteredAgentTemplates.length === 0) return null;

        return (
          <Panel
            key={agentCode}
            header={
              <Space>
                <Avatar icon={<RobotOutlined />} size="small" />
                <Text strong>{agent?.agentName || agentCode}</Text>
                <Badge count={filteredAgentTemplates.length} />
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {filteredAgentTemplates.map((template) => {
                const typeConfig = getTypeConfig(template.typeCode);
                const statusConfig = statusOptions.find(
                  (s) => s.value === template.statusCode
                );

                return (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    key={template.templateCode}
                  >
                    <Card
                      size="small"
                      hoverable
                      style={{
                        borderRadius: borderRadiusLG,
                        border: `1px solid ${typeConfig.color}20`,
                        background: `${typeConfig.color}05`,
                      }}
                      bodyStyle={{ padding: 16 }}
                      actions={[
                        <Tooltip title="Chỉnh sửa" key="edit">
                          <EditOutlined onClick={() => handleEdit(template)} />
                        </Tooltip>,
                      ]}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <Space>
                          {typeConfig.icon}
                          <Text strong style={{ fontSize: 14 }}>
                            {template.templateName}
                          </Text>
                        </Space>
                      </div>

                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {template.templateCode}
                      </Text>

                      {template.description && (
                        <Text
                          style={{
                            fontSize: 12,
                            lineHeight: 1.4,
                            display: "block",
                            marginBottom: 12,
                          }}
                        >
                          {template.description.length > 60
                            ? `${template.description.substring(0, 60)}...`
                            : template.description}
                        </Text>
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Tag
                          icon={typeConfig.icon}
                          color={typeConfig.color}
                          style={{ fontSize: 11 }}
                        >
                          {typeConfig.label}
                        </Tag>
                        <Tag
                          color={statusConfig?.color}
                          style={{ fontSize: 11 }}
                        >
                          {statusConfig?.label}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Panel>
        );
      })
      .filter(Boolean);

    return agentGroups.length > 0 ? (
      <Collapse defaultActiveKey={Object.keys(groupedTemplates)} ghost>
        {agentGroups}
      </Collapse>
    ) : (
      <Empty
        description="Không tìm thấy template nào"
        style={{ padding: "40px 0" }}
      />
    );
  };

  return (
    <div
      style={{
        padding: 16,
        background: "transparent",
        minHeight: "100%",
      }}
    >
      <Card
        title={
          <Space>
            <CodeOutlined style={{ color: colorPrimary }} />
            <span>Quản lý Template</span>
            <Badge count={templates.length} />
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => actionRef.current?.reload()}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm Template
            </Button>
          </Space>
        }
        style={{
          borderRadius: borderRadiusLG,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Filter Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm template..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo agent"
              allowClear
              value={selectedAgent}
              onChange={setSelectedAgent}
            >
              {agents.map((agent) => (
                <Select.Option key={agent.agentCode} value={agent.agentCode}>
                  <Space>
                    <Avatar size="small" icon={<RobotOutlined />} />
                    {agent.agentName} ({agent.agentCode})
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Space.Compact>
                <Button
                  icon={<BarsOutlined />}
                  type={viewMode === "table" ? "primary" : "default"}
                  onClick={() => setViewMode("table")}
                >
                  Bảng
                </Button>
                <Button
                  icon={<AppstoreOutlined />}
                  type={viewMode === "card" ? "primary" : "default"}
                  onClick={() => setViewMode("card")}
                >
                  Thẻ
                </Button>
              </Space.Compact>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        {/* Content */}
        {viewMode === "table" ? (
          <ProTable<ITemplate>
            columns={columns}
            actionRef={actionRef}
            request={fetchTemplates}
            rowKey="templateCode"
            search={false}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
            }}
            scroll={{ x: 1200 }}
            size="small"
          />
        ) : (
          renderCardView()
        )}
      </Card>

      {/* Modal Form */}
      <Modal
        title={
          <Space>
            <CodeOutlined />
            {editingTemplate ? "Chỉnh sửa Template" : "Thêm Template"}
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={900}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Thông tin cơ bản" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="templateCode"
                    label="Mã Template"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã template" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập mã template"
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
                    <Input placeholder="Nhập tên template" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="typeCode" label="Loại">
                    <Select placeholder="Chọn loại template">
                      {typeOptions.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                          <Space>
                            {option.icon}
                            {option.label}
                          </Space>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="typeName" label="Tên loại">
                    <Input placeholder="Nhập tên loại" />
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
                        <Select.Option
                          key={agent.agentCode}
                          value={agent.agentCode}
                        >
                          <Space>
                            <Avatar size="small" icon={<RobotOutlined />} />
                            {agent.agentName} ({agent.agentCode})
                          </Space>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="statusCode"
                    label="Trạng thái"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select placeholder="Chọn trạng thái">
                      {statusOptions.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                          <Tag color={option.color}>{option.label}</Tag>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="workflowCode" label="Mã Workflow">
                    <Input placeholder="Nhập mã workflow" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="workflowName" label="Tên Workflow">
                    <Input placeholder="Nhập tên workflow" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Mô tả">
                <TextArea rows={3} placeholder="Nhập mô tả template" />
              </Form.Item>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <span>
                  <SettingOutlined />
                  Cấu hình
                </span>
              }
              key="2"
            >
              <Form.Item name="metadata" label="Metadata">
                <TextArea rows={3} placeholder="Nhập metadata (JSON)" />
              </Form.Item>

              <Form.Item name="info" label="Thông tin">
                <TextArea rows={3} placeholder="Nhập thông tin (JSON)" />
              </Form.Item>

              <Form.Item name="schema" label="Schema">
                <TextArea rows={3} placeholder="Nhập schema (JSON)" />
              </Form.Item>

              <Form.Item name="body" label="Body Template">
                <TextArea rows={3} placeholder="Nhập body template" />
              </Form.Item>

              <Form.Item name="rule" label="Rule">
                <TextArea rows={3} placeholder="Nhập rule (JSON)" />
              </Form.Item>

              <Form.Item name="configuration" label="Cấu hình">
                <TextArea rows={3} placeholder="Nhập cấu hình (JSON)" />
              </Form.Item>

              <Form.Item name="outputCode" label="Mã đầu ra">
                <Input placeholder="Nhập mã đầu ra" />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplatePage;
