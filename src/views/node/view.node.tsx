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
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";
import { INode } from "../../interface/workflow.interface";
import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";

const { Search } = Input;
const { Option } = Select;

const NodePage: React.FC = () => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<INode | null>(null);
  const [form] = Form.useForm();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "INACTIVE", label: "Inactive", color: "red" },
    { value: "PROCESSING", label: "Processing", color: "blue" },
    { value: "ERROR", label: "Error", color: "red" },
  ];

  const fetchNodes = async () => {
    setLoading(true);
    try {
      // Get all workflows and extract nodes
      const workflowResponse = await workflowApi.getWorkflows({
        pageSize: 1000,
      });
      const allNodes: INode[] = [];

      workflowResponse.data.forEach((workflow) => {
        if (workflow.nodes) {
          workflow.nodes.forEach((node) => {
            allNodes.push({
              ...node,
              workflowCode: workflow.workflowCode,
              workflowName: workflow.workflowName,
            });
          });
        }
      });

      setNodes(allNodes);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      message.error("Failed to load nodes");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [templatesRes, workflowsRes] = await Promise.all([
        templateApi.getTemplates({ pageSize: 1000 }),
        workflowApi.getWorkflows({ pageSize: 1000 }),
      ]);
      setTemplates(templatesRes.data);
      setWorkflows(workflowsRes.data);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      message.error("Failed to load reference data");
    }
  };

  useEffect(() => {
    fetchNodes();
    fetchReferenceData();
  }, []);

  const handleCreate = () => {
    setEditingNode(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (node: INode) => {
    setEditingNode(node);
    form.setFieldsValue(node);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Note: Node creation/update would need to be implemented in backend
      // For now, just show success message
      message.success(
        "Node operation completed (backend implementation needed)"
      );
      setModalVisible(false);
      fetchNodes();
    } catch (error) {
      console.error("Error saving node:", error);
      message.error("Failed to save node");
    }
  };

  const columns = [
    {
      title: "Node Code",
      dataIndex: "nodeCode",
      key: "nodeCode",
      width: 150,
    },
    {
      title: "Node Name",
      dataIndex: "nodeName",
      key: "nodeName",
      width: 200,
    },
    {
      title: "Template",
      dataIndex: "templateName",
      key: "templateName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Workflow",
      dataIndex: "workflowName",
      key: "workflowName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Agent",
      dataIndex: "agentName",
      key: "agentName",
      width: 120,
    },
    {
      title: "Type",
      dataIndex: "templateType",
      key: "templateType",
      width: 100,
      render: (type: string) => (
        <Tag
          color={
            type === "webhook"
              ? "green"
              : type === "schedule"
              ? "blue"
              : type === "restapi"
              ? "orange"
              : "default"
          }
        >
          {type?.toUpperCase() || "N/A"}
        </Tag>
      ),
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
      title: "Actions",
      key: "action",
      width: 120,
      render: (_: any, record: INode) => (
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
            title={
              <Space>
                <NodeExpandOutlined />
                Node Management
              </Space>
            }
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={() => fetchNodes()}>
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  disabled
                  title="Create nodes through Workflow Builder"
                >
                  Add Node
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col span={24}>
                <Space>
                  <Search
                    placeholder="Search nodes..."
                    allowClear
                    style={{ width: 300 }}
                  />
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    Nodes are created through the Workflow Builder
                  </span>
                </Space>
              </Col>
            </Row>

            {nodes.length > 0 ? (
              <Table
                columns={columns}
                dataSource={nodes}
                rowKey={(record) => `${record.workflowCode}-${record.nodeCode}`}
                loading={loading}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                scroll={{ x: 1200 }}
              />
            ) : (
              <Empty
                description="No nodes found. Create nodes through the Workflow Builder."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingNode ? "Edit Node" : "Add Node"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nodeCode"
                label="Node Code"
                rules={[{ required: true, message: "Please enter node code" }]}
              >
                <Input placeholder="Enter node code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nodeName"
                label="Node Name"
                rules={[{ required: true, message: "Please enter node name" }]}
              >
                <Input placeholder="Enter node name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="templateCode"
                label="Template"
                rules={[{ required: true, message: "Please select template" }]}
              >
                <Select placeholder="Select template" showSearch>
                  {templates.map((template) => (
                    <Option
                      key={template.templateCode}
                      value={template.templateCode}
                    >
                      {template.templateName} ({template.templateCode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="workflowCode"
                label="Workflow"
                rules={[{ required: true, message: "Please select workflow" }]}
              >
                <Select placeholder="Select workflow" showSearch>
                  {workflows.map((workflow) => (
                    <Option
                      key={workflow.workflowCode}
                      value={workflow.workflowCode}
                    >
                      {workflow.workflowName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item name="outputCode" label="Output Code">
                <Input placeholder="Enter output code" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NodePage;
