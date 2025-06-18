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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  CodeOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";
import { INode, INodeSearchParams } from "../../interface/node.interface";
import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IAgent } from "../../interface/agent.interface";
import nodeApi from "../../apis/node/api.node";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";
import agentApi from "../../apis/agent/api.agent";

const { Search, TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const NodePage: React.FC = () => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<INode | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<INodeSearchParams>({
    page: 0,
    size: 10,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Hoạt động", color: "green" },
    { value: "INACTIVE", label: "Không hoạt động", color: "red" },
    { value: "PROCESSING", label: "Đang xử lý", color: "blue" },
    { value: "ERROR", label: "Lỗi", color: "red" },
  ];

  const fetchNodes = async (params?: INodeSearchParams) => {
    setLoading(true);
    try {
      const response = await nodeApi.getNodes({ ...searchParams, ...params });
      setNodes(response.content);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách node");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [templatesRes, workflowsRes, agentsRes] = await Promise.all([
        templateApi.getTemplates({ size: 1000 }),
        workflowApi.getWorkflows({ size: 1000 }),
        agentApi.getAgents({ size: 1000 }),
      ]);
      setTemplates(templatesRes.content);
      setWorkflows(workflowsRes.content);
      setAgents(agentsRes.content);
    } catch (error) {
      message.error("Không thể tải dữ liệu tham chiếu");
    }
  };

  useEffect(() => {
    fetchNodes();
    fetchReferenceData();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, page: 0 };
    setSearchParams(newParams);
    fetchNodes(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = { ...searchParams, page: page - 1, size: pageSize || 10 };
    setSearchParams(newParams);
    fetchNodes(newParams);
  };

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

  const handleDelete = async (id: number) => {
    try {
      await nodeApi.deleteNode(id);
      message.success("Xóa node thành công");
      fetchNodes();
    } catch (error) {
      message.error("Không thể xóa node");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const selectedTemplate = templates.find(
        (t) => t.templateCode === values.templateCode
      );
      const selectedWorkflow = workflows.find(
        (w) => w.workflowCode === values.workflowCode
      );
      const selectedAgent = agents.find(
        (a) => a.agentCode === values.agentCode
      );

      const nodeData = {
        ...values,
        templateName: selectedTemplate?.templateName || "",
        workflowName: selectedWorkflow?.workflowName || "",
        agentName: selectedAgent?.agentName || "",
        statusName:
          statusOptions.find((s) => s.value === values.statusCode)?.label || "",
        templateType: selectedTemplate?.templateType || "",
        typeName: selectedTemplate?.typeName || "",
      };

      if (editingNode) {
        await nodeApi.updateNode(editingNode.nodeId!, nodeData);
        message.success("Cập nhật node thành công");
      } else {
        await nodeApi.createNode(nodeData);
        message.success("Tạo node thành công");
      }
      setModalVisible(false);
      fetchNodes();
    } catch (error) {
      message.error("Không thể lưu node");
    }
  };

  const columns = [
    {
      title: "Mã Node",
      dataIndex: "nodeCode",
      key: "nodeCode",
      width: 120,
    },
    {
      title: "Tên Node",
      dataIndex: "nodeName",
      key: "nodeName",
      width: 150,
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
      title: "Trạng thái",
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
      title: "Output",
      dataIndex: "outputCode",
      key: "outputCode",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_: any, record: INode) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa node này?"
            onConfirm={() => handleDelete(record.nodeId!)}
            okText="Có"
            cancelText="Không"
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
            title={
              <Space>
                <NodeExpandOutlined />
                Quản lý Node
              </Space>
            }
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={() => fetchNodes()}>
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm Node
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Tìm kiếm node..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={nodes}
              rowKey="nodeId"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} bản ghi`,
                onChange: handleTableChange,
                onShowSizeChange: handleTableChange,
              }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingNode ? "Sửa Node" : "Thêm Node"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={900}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông tin chính" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nodeCode"
                    label="Mã Node"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã node" },
                    ]}
                  >
                    <Input placeholder="Nhập mã node" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nodeName"
                    label="Tên Node"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên node" },
                    ]}
                  >
                    <Input placeholder="Nhập tên node" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="templateCode"
                    label="Template"
                    rules={[
                      { required: true, message: "Vui lòng chọn template" },
                    ]}
                  >
                    <Select placeholder="Chọn template" showSearch>
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
                    rules={[
                      { required: true, message: "Vui lòng chọn workflow" },
                    ]}
                  >
                    <Select placeholder="Chọn workflow" showSearch>
                      {workflows.map((workflow) => (
                        <Option
                          key={workflow.workflowCode}
                          value={workflow.workflowCode}
                        >
                          {workflow.workflowName} ({workflow.workflowCode})
                        </Option>
                      ))}
                    </Select>
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
                    <Select placeholder="Chọn agent" showSearch>
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
                    label="Trạng thái"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select placeholder="Chọn trạng thái">
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
                  <Form.Item name="typeCode" label="Mã loại">
                    <Input placeholder="Nhập mã loại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="outputCode" label="Output Code">
                    <Input placeholder="Nhập output code" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Mô tả">
                <TextArea rows={3} placeholder="Nhập mô tả" />
              </Form.Item>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CodeOutlined />
                  Cấu hình
                </span>
              }
              key="2"
            >
              <Form.Item name="metadata" label="Metadata">
                <TextArea rows={4} placeholder="Nhập metadata (JSON)" />
              </Form.Item>

              <Form.Item name="schema" label="Schema">
                <TextArea rows={4} placeholder="Nhập schema (JSON)" />
              </Form.Item>

              <Form.Item name="body" label="Body">
                <TextArea rows={4} placeholder="Nhập body template" />
              </Form.Item>

              <Form.Item name="rule" label="Rule">
                <TextArea rows={4} placeholder="Nhập rule (JSON)" />
              </Form.Item>

              <Form.Item name="configuration" label="Configuration">
                <TextArea rows={4} placeholder="Nhập configuration (JSON)" />
              </Form.Item>

              <Form.Item name="info" label="Info">
                <TextArea rows={3} placeholder="Nhập thông tin bổ sung" />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};

export default NodePage;
