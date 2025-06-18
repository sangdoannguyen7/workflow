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
  List,
  Typography,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ApartmentOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  IWorkflow,
  IWorkflowSearchParams,
} from "../../interface/workflow.interface";
import workflowApi from "../../apis/workflow/api.workflow";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const WorkflowPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<IWorkflow | null>(
    null
  );
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<IWorkflowSearchParams>({
    current: 1,
    pageSize: 20,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "INACTIVE", label: "Inactive", color: "red" },
    { value: "DRAFT", label: "Draft", color: "orange" },
    { value: "PUBLISHED", label: "Published", color: "blue" },
  ];

  const fetchWorkflows = async (params?: IWorkflowSearchParams) => {
    setLoading(true);
    try {
      const response = await workflowApi.getWorkflows({
        ...searchParams,
        ...params,
      });
      setWorkflows(response.data);
      setPagination({
        current: response.current,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error("Error fetching workflows:", error);
      message.error("Failed to load workflows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, current: 1 };
    setSearchParams(newParams);
    fetchWorkflows(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = {
      ...searchParams,
      current: page,
      pageSize: pageSize || 20,
    };
    setSearchParams(newParams);
    fetchWorkflows(newParams);
  };

  const handleCreate = () => {
    setEditingWorkflow(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (workflow: IWorkflow) => {
    setEditingWorkflow(workflow);
    form.setFieldsValue(workflow);
    setModalVisible(true);
  };

  const handleDelete = async (workflowCode: string) => {
    try {
      await workflowApi.deleteWorkflow(workflowCode);
      message.success("Workflow deleted successfully");
      fetchWorkflows();
    } catch (error) {
      console.error("Error deleting workflow:", error);
      message.error("Failed to delete workflow");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const workflowData = {
        ...values,
        statusName:
          statusOptions.find((s) => s.value === values.statusCode)?.label || "",
        nodes: [],
      };

      if (editingWorkflow) {
        await workflowApi.updateWorkflow(
          editingWorkflow.workflowCode,
          workflowData
        );
        message.success("Workflow updated successfully");
      } else {
        await workflowApi.createWorkflow(workflowData);
        message.success("Workflow created successfully");
      }
      setModalVisible(false);
      fetchWorkflows();
    } catch (error) {
      console.error("Error saving workflow:", error);
      message.error("Failed to save workflow");
    }
  };

  const onExpand = (expanded: boolean, record: IWorkflow) => {
    if (expanded) {
      setExpandedRowKeys((prev) => [...prev, record.workflowCode]);
    } else {
      setExpandedRowKeys((prev) =>
        prev.filter((key) => key !== record.workflowCode)
      );
    }
  };

  const expandedRowRender = (record: IWorkflow) => {
    const nodes = record.nodes || [];

    return (
      <div
        style={{ padding: "16px", background: "#fafafa", borderRadius: "6px" }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space style={{ marginBottom: "12px" }}>
              <Text strong>Nodes in Workflow:</Text>
              <Tag color="blue">{nodes.length} node(s)</Tag>
            </Space>
          </Col>
        </Row>

        {nodes.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={nodes}
            renderItem={(node) => (
              <List.Item>
                <Card size="small" style={{ borderRadius: "6px" }}>
                  <Space
                    direction="vertical"
                    size={4}
                    style={{ width: "100%" }}
                  >
                    <Text strong>{node.nodeName}</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {node.nodeCode}
                    </Text>
                    <Text style={{ fontSize: "12px" }}>
                      Template: {node.templateName}
                    </Text>
                    <Text style={{ fontSize: "12px" }}>
                      Agent: {node.agentName}
                    </Text>
                    <Tag
                      size="small"
                      color={
                        statusOptions.find((s) => s.value === node.statusCode)
                          ?.color || "default"
                      }
                    >
                      {node.statusName}
                    </Tag>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No nodes in this workflow</Text>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: "Workflow Code",
      dataIndex: "workflowCode",
      key: "workflowCode",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Workflow Name",
      dataIndex: "workflowName",
      key: "workflowName",
      width: 250,
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
      title: "Nodes",
      key: "nodeCount",
      width: 80,
      render: (_: any, record: IWorkflow) => (
        <Badge count={record.nodes?.length || 0} color="blue" />
      ),
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
      width: 200,
      render: (_: any, record: IWorkflow) => (
        <Space size="small">
          <Button
            type="text"
            icon={<ApartmentOutlined />}
            onClick={() =>
              window.open(
                `/management?tab=builder&workflow=${record.workflowCode}`,
                "_blank"
              )
            }
            size="small"
            title="Design workflow"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this workflow?"
            onConfirm={() => handleDelete(record.workflowCode)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              title="Delete"
            />
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
            title={
              <Space>
                <ApartmentOutlined />
                Workflow Management
              </Space>
            }
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchWorkflows()}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Add Workflow
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Search workflows..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={workflows}
              rowKey="workflowCode"
              loading={loading}
              expandable={{
                expandedRowRender,
                onExpand,
                expandIcon: ({ expanded, onExpand, record }) => (
                  <Button
                    type="text"
                    icon={<SettingOutlined />}
                    size="small"
                    onClick={(e) => onExpand(record, e)}
                    style={{
                      transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                ),
              }}
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
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingWorkflow ? "Edit Workflow" : "Add Workflow"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="workflowName"
                label="Workflow Name"
                rules={[
                  { required: true, message: "Please enter workflow name" },
                ]}
              >
                <Input placeholder="Enter workflow name" />
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
            <Input.TextArea rows={4} placeholder="Enter workflow description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkflowPage;
