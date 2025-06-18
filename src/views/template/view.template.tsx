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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  ITemplate,
  ITemplateSearchParams,
} from "../../interface/template.interface";
import { IAgent } from "../../interface/agent.interface";
import templateApi from "../../apis/template/api.template";
import agentApi from "../../apis/agent/api.agent";

const { Search } = Input;
const { Option } = Select;

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

  const fetchTemplates = async (params?: ITemplateSearchParams) => {
    setLoading(true);
    try {
      const response = await templateApi.getTemplates({
        ...searchParams,
        ...params,
      });
      setTemplates(response.data);
      setPagination({
        current: response.current,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error("Error fetching templates:", error);
      message.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await agentApi.getAgents({ pageSize: 1000 });
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      message.error("Failed to load agents");
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
    setModalVisible(true);
  };

  const handleEdit = (template: ITemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await templateApi.deleteTemplate(id);
      message.success("Template deleted successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      message.error("Failed to delete template");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const selectedAgent = agents.find(
        (a) => a.agentCode === values.agentCode
      );
      const templateData = {
        ...values,
        agentName: selectedAgent?.agentName || "",
        statusName:
          statusOptions.find((s) => s.value === values.statusCode)?.label || "",
      };

      if (editingTemplate) {
        await templateApi.updateTemplate(
          editingTemplate.templateId,
          templateData
        );
        message.success("Template updated successfully");
      } else {
        await templateApi.createTemplate(templateData);
        message.success("Template created successfully");
      }
      setModalVisible(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      message.error("Failed to save template");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "templateId",
      key: "templateId",
      width: 80,
    },
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
      title: "Agent",
      dataIndex: "agentName",
      key: "agentName",
      width: 150,
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
      width: 150,
      render: (_: any, record: ITemplate) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this template?"
            onConfirm={() => handleDelete(record.templateId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
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

            <Table
              columns={columns}
              dataSource={templates}
              rowKey="templateId"
              loading={loading}
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
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingTemplate ? "Edit Template" : "Add Template"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="templateCode"
                label="Template Code"
                rules={[
                  { required: true, message: "Please enter template code" },
                ]}
              >
                <Input placeholder="Enter template code" />
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
                rules={[{ required: true, message: "Please select status" }]}
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

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplatePage;
