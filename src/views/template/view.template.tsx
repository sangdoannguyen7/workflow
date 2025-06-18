import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Row,
  Col,
  Tag,
  theme,
  Tabs,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import {
  ITemplate,
  ITemplateSearchParams,
  ITemplateRequest,
} from "../../interface/template.interface";
import { IAgent } from "../../interface/agent.interface";
import templateApi from "../../apis/template/api.template";
import agentApi from "../../apis/agent/api.agent";

const { Search, TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const TemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ITemplate | null>(
    null
  );
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<ITemplateSearchParams>({
    current: 1,
    pageSize: 20,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "INACTIVE", label: "Inactive", color: "red" },
    { value: "DRAFT", label: "Draft", color: "orange" },
  ];

  const typeOptions = [
    { value: "webhook", label: "Webhook" },
    { value: "schedule", label: "Schedule" },
    { value: "restapi", label: "REST API" },
    { value: "process", label: "Process" },
  ];

  const fetchTemplates = async (params?: ITemplateSearchParams) => {
    setLoading(true);
    try {
      console.log("Fetching templates with params:", {
        ...searchParams,
        ...params,
      });
      const response = await templateApi.getTemplates({
        ...searchParams,
        ...params,
      });
      console.log("Templates response:", response);

      if (response.success && response.data) {
        setTemplates(response.data);
        setPagination({
          current: response.current,
          pageSize: response.pageSize,
          total: response.total,
        });
      } else {
        console.warn("Invalid response format:", response);
        setTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      message.error(
        "Failed to load templates. Please check the API connection."
      );
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      console.log("Fetching agents...");
      const response = await agentApi.getAgents({ pageSize: 1000 });
      console.log("Agents response:", response);

      if (response.success && response.data) {
        setAgents(response.data);
      } else {
        console.warn("Invalid agents response format:", response);
        setAgents([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      message.error("Failed to load agents");
      setAgents([]);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchAgents();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, current: 1 };
    setSearchParams(newParams);
    fetchTemplates(newParams);
  };

  const handleAgentFilter = (agentCode: string) => {
    const newParams = {
      ...searchParams,
      agentCode: agentCode || "",
      current: 1,
    };
    setSearchParams(newParams);
    fetchTemplates(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = {
      ...searchParams,
      current: page,
      pageSize: pageSize || 20,
    };
    setSearchParams(newParams);
    fetchTemplates(newParams);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    form.resetFields();
    // Set default values
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
      // Ensure all fields are populated
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
      console.log("Submitting template:", values);

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

      let result;
      if (editingTemplate) {
        console.log(
          "Updating template:",
          editingTemplate.templateCode,
          templateRequest
        );
        result = await templateApi.updateTemplate(
          editingTemplate.templateCode,
          templateRequest
        );
        message.success("Template updated successfully");
      } else {
        console.log("Creating template:", templateRequest);
        result = await templateApi.createTemplate(templateRequest);
        message.success("Template created successfully");
      }

      console.log("Template operation result:", result);
      setModalVisible(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      message.error("Failed to save template. Please check the form data.");
    }
  };

  const columns = [
    {
      title: "Template Code",
      dataIndex: "templateCode",
      key: "templateCode",
      width: 150,
    },
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
      width: 200,
    },
    {
      title: "Type",
      dataIndex: "typeCode",
      key: "typeCode",
      width: 120,
      render: (typeCode: string) => {
        if (!typeCode) return <Tag>N/A</Tag>;
        const color =
          typeCode === "webhook"
            ? "green"
            : typeCode === "schedule"
            ? "blue"
            : typeCode === "restapi"
            ? "orange"
            : "default";
        return <Tag color={color}>{typeCode.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Agent",
      dataIndex: "agentName",
      key: "agentName",
      width: 150,
      render: (text: string) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "statusCode",
      key: "statusCode",
      width: 120,
      render: (statusCode: string) => {
        const status = statusOptions.find((s) => s.value === statusCode);
        return status ? (
          <Tag color={status.color}>{status.label}</Tag>
        ) : (
          <Tag>{statusCode}</Tag>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => text || "N/A",
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_: any, record: ITemplate) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        background: colorBgContainer,
        borderRadius: "8px",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Template Management"
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchTemplates()}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Add Template
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Search templates..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Filter by agent"
                  allowClear
                  onChange={handleAgentFilter}
                >
                  {agents.map((agent) => (
                    <Option key={agent.agentCode} value={agent.agentCode}>
                      {agent.agentName} ({agent.agentCode})
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={templates}
                rowKey="templateCode"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  onChange: handleTableChange,
                  onShowSizeChange: handleTableChange,
                }}
                scroll={{ x: 1200 }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingTemplate ? "Edit Template" : "Add Template"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Basic Info" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="templateCode"
                    label="Template Code"
                    rules={[
                      { required: true, message: "Please enter template code" },
                    ]}
                  >
                    <Input
                      placeholder="Enter template code"
                      disabled={!!editingTemplate}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="templateName"
                    label="Template Name"
                    rules={[
                      { required: true, message: "Please enter template name" },
                    ]}
                  >
                    <Input placeholder="Enter template name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="typeCode" label="Type">
                    <Select placeholder="Select type">
                      {typeOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="typeName" label="Type Name">
                    <Input placeholder="Enter type name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="agentCode"
                    label="Agent"
                    rules={[{ required: true, message: "Please select agent" }]}
                  >
                    <Select placeholder="Select agent">
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
                    name="statusCode"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select status" },
                    ]}
                  >
                    <Select placeholder="Select status">
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="workflowCode" label="Workflow Code">
                    <Input placeholder="Enter workflow code" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="workflowName" label="Workflow Name">
                    <Input placeholder="Enter workflow name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Description">
                <TextArea rows={3} placeholder="Enter description" />
              </Form.Item>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CodeOutlined />
                  Configuration
                </span>
              }
              key="2"
            >
              <Form.Item name="metadata" label="Metadata">
                <TextArea rows={3} placeholder="Enter metadata (JSON)" />
              </Form.Item>

              <Form.Item name="info" label="Info">
                <TextArea rows={3} placeholder="Enter info (JSON)" />
              </Form.Item>

              <Form.Item name="schema" label="Schema">
                <TextArea rows={3} placeholder="Enter schema (JSON)" />
              </Form.Item>

              <Form.Item name="body" label="Body">
                <TextArea rows={3} placeholder="Enter body template" />
              </Form.Item>

              <Form.Item name="rule" label="Rule">
                <TextArea rows={3} placeholder="Enter rule (JSON)" />
              </Form.Item>

              <Form.Item name="configuration" label="Configuration">
                <TextArea rows={3} placeholder="Enter configuration (JSON)" />
              </Form.Item>

              <Form.Item name="outputCode" label="Output Code">
                <Input placeholder="Enter output code" />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplatePage;
