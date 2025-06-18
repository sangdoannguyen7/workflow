import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Drawer,
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
import { IAgent, IAgentSearchParams } from "../../interface/agent.interface";
import agentApi from "../../apis/agent/api.agent";

const { Search } = Input;
const { Option } = Select;

const AgentPage: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<IAgent | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<IAgentSearchParams>({
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
    { value: "PENDING", label: "Pending", color: "orange" },
  ];

  const fetchAgents = async (params?: IAgentSearchParams) => {
    setLoading(true);
    try {
      const response = await agentApi.getAgents({ ...searchParams, ...params });
      setAgents(response.data);
      setPagination({
        current: response.current,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error("Error fetching agents:", error);
      message.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, current: 1 };
    setSearchParams(newParams);
    fetchAgents(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = {
      ...searchParams,
      current: page,
      pageSize: pageSize || 20,
    };
    setSearchParams(newParams);
    fetchAgents(newParams);
  };

  const handleCreate = () => {
    setEditingAgent(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (agent: IAgent) => {
    setEditingAgent(agent);
    form.setFieldsValue(agent);
    setDrawerVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await agentApi.deleteAgent(id);
      message.success("Agent deleted successfully");
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
      message.error("Failed to delete agent");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAgent) {
        await agentApi.updateAgent(editingAgent.agentId, values);
        message.success("Agent updated successfully");
      } else {
        await agentApi.createAgent(values);
        message.success("Agent created successfully");
      }
      setDrawerVisible(false);
      fetchAgents();
    } catch (error) {
      console.error("Error saving agent:", error);
      message.error("Failed to save agent");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "agentId",
      key: "agentId",
      width: 80,
    },
    {
      title: "Agent Code",
      dataIndex: "agentCode",
      key: "agentCode",
      width: 150,
    },
    {
      title: "Agent Name",
      dataIndex: "agentName",
      key: "agentName",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "statusCode",
      key: "statusCode",
      width: 120,
      render: (statusCode: string) => {
        if (!statusCode) return <Tag>N/A</Tag>;
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
      width: 100,
      render: (_: any, record: IAgent) => (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            padding: "4px 6px",
            borderRadius: "6px",
            border: "1px solid rgba(25, 118, 210, 0.1)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
            minHeight: "32px",
          }}
        >
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
              style={{
                border: "none",
                background: "transparent",
                color: "#1976D2",
              }}
            />
            <Popconfirm
              title="Are you sure you want to delete this agent?"
              onConfirm={() => handleDelete(record.agentId)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#D32F2F",
                }}
              />
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "8px",
        background: "transparent",
        borderRadius: "8px",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Agent Management"
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={() => fetchAgents()}>
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Add Agent
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Search agents..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={agents}
              rowKey="agentId"
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
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        title={editingAgent ? "Edit Agent" : "Add Agent"}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={480}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {editingAgent ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="agentCode"
            label="Agent Code"
            rules={[{ required: true, message: "Please enter agent code" }]}
          >
            <Input placeholder="Enter agent code" />
          </Form.Item>

          <Form.Item
            name="agentName"
            label="Agent Name"
            rules={[{ required: true, message: "Please enter agent name" }]}
          >
            <Input placeholder="Enter agent name" />
          </Form.Item>

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

          <Form.Item name="statusName" label="Status Name">
            <Input placeholder="Enter status name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AgentPage;
