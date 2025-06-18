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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import nodeApi from "../../apis/node/api.node";
import workflowApi from "../../apis/workflow/api.workflow";
import templateApi from "../../apis/template/api.template";
import { INode } from "../../interface/node.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { ITemplate } from "../../interface/template.interface";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const NodePage: React.FC = () => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [workflowFilter, setWorkflowFilter] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<INode | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // Load nodes
  const loadNodes = async (params?: any) => {
    setLoading(true);
    try {
      const response = await nodeApi.getNodes({
        ...params,
        search: searchText,
        statusCode: statusFilter,
        workflowCode: workflowFilter,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      setNodes(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách node");
    } finally {
      setLoading(false);
    }
  };

  // Load workflows and templates
  const loadReferences = async () => {
    try {
      const [workflowResponse, templateResponse] = await Promise.all([
        workflowApi.getWorkflows({ size: 1000 }),
        templateApi.getTemplates({ size: 1000 }),
      ]);
      setWorkflows(workflowResponse.content);
      setTemplates(templateResponse.content);
    } catch (error) {
      message.error("Không thể tải dữ liệu tham chiếu");
    }
  };

  // Handle create/update node
  const handleSave = async (values: any) => {
    try {
      const selectedTemplate = templates.find(
        (t) => t.templateCode === values.templateCode
      );
      const selectedWorkflow = workflows.find(
        (w) => w.workflowCode === values.workflowCode
      );

      const nodeData = {
        ...values,
        templateName: selectedTemplate?.templateName || "",
        workflowName: selectedWorkflow?.workflowName || "",
        agentName: selectedTemplate?.agentName || "",
        search:
          `${values.nodeName} ${values.description} ${selectedTemplate?.templateType}`.toLowerCase(),
      };

      if (editingNode) {
        await nodeApi.updateNode(editingNode.nodeCode, nodeData);
        message.success("Cập nhật node thành công");
      } else {
        await nodeApi.createNode(nodeData);
        message.success("Tạo node thành công");
      }

      setIsModalVisible(false);
      setEditingNode(null);
      form.resetFields();
      loadNodes();
    } catch (error) {
      message.error("Lỗi khi lưu node");
    }
  };

  // Handle delete node
  const handleDelete = async (nodeCode: string) => {
    try {
      await nodeApi.deleteNode(nodeCode);
      message.success("Xóa node thành công");
      loadNodes();
    } catch (error) {
      message.error("Lỗi khi xóa node");
    }
  };

  // Show create modal
  const showCreateModal = () => {
    setEditingNode(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show edit modal
  const showEditModal = (node: INode) => {
    setEditingNode(node);
    form.setFieldsValue(node);
    setIsModalVisible(true);
  };

  // Show detail drawer
  const showDetail = (node: INode) => {
    setSelectedNode(node);
    setIsDetailVisible(true);
  };

  // Handle search and filters
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "workflow") {
      setWorkflowFilter(value);
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
  const columns: ColumnsType<INode> = [
    {
      title: "Node Code",
      dataIndex: "nodeCode",
      key: "nodeCode",
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: "Tên Node",
      dataIndex: "nodeName",
      key: "nodeName",
      ellipsis: true,
      render: (text) => (
        <Space>
          <NodeExpandOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Template",
      dataIndex: "templateCode",
      key: "templateCode",
      width: 150,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 12 }}>
            {record.templateName}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "Workflow",
      dataIndex: "workflowCode",
      key: "workflowCode",
      width: 150,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 12 }}>
            {record.workflowName}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {text}
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
            title="Bạn có chắc muốn xóa node này?"
            onConfirm={() => handleDelete(record.nodeCode)}
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
    loadNodes();
  }, [
    searchText,
    statusFilter,
    workflowFilter,
    pagination.current,
    pagination.pageSize,
  ]);

  useEffect(() => {
    loadReferences();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              <NodeExpandOutlined /> Quản lý Node
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Tạo Node
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm node..."
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo workflow"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("workflow", value)}
            >
              <Option value="">Tất cả workflow</Option>
              {workflows.map((workflow) => (
                <Option
                  key={workflow.workflowCode}
                  value={workflow.workflowCode}
                >
                  {workflow.workflowName}
                </Option>
              ))}
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
            <Button icon={<ReloadOutlined />} onClick={() => loadNodes()}>
              Làm mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={nodes}
          rowKey="nodeCode"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} node`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingNode ? "Chỉnh sửa Node" : "Tạo Node mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNode(null);
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
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nodeCode"
                label="Node Code"
                rules={[{ required: true, message: "Vui lòng nhập node code" }]}
              >
                <Input
                  placeholder="VD: NODE_WEBHOOK_START"
                  disabled={!!editingNode}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nodeName"
                label="Tên Node"
                rules={[{ required: true, message: "Vui lòng nhập tên node" }]}
              >
                <Input placeholder="VD: Webhook Start Node" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="workflowCode"
                label="Workflow"
                rules={[{ required: true, message: "Vui lòng chọn workflow" }]}
              >
                <Select placeholder="Chọn workflow">
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
            <Col span={12}>
              <Form.Item
                name="templateCode"
                label="Template"
                rules={[{ required: true, message: "Vui lòng chọn template" }]}
              >
                <Select placeholder="Chọn template">
                  {templates.map((template) => (
                    <Option
                      key={template.templateCode}
                      value={template.templateCode}
                    >
                      {template.templateName} ({template.templateType})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={8}>
              <Form.Item
                name="agentCode"
                label="Agent Code"
                rules={[
                  { required: true, message: "Vui lòng nhập agent code" },
                ]}
              >
                <Input placeholder="VD: WEBHOOK_AGENT" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả chi tiết về node..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="info" label="Thông tin bổ sung">
                <TextArea
                  rows={4}
                  placeholder="Thông tin chi tiết về node..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="configuration" label="Cấu hình (JSON)">
                <TextArea
                  rows={4}
                  placeholder='{"timeout": 30000, "retries": 3}'
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingNode ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingNode(null);
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
        title="Chi tiết Node"
        placement="right"
        width={600}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedNode && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="Node Code">
                <Text code>{selectedNode.nodeCode}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Node">
                <Text strong>{selectedNode.nodeName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Template">
                <div>
                  <Text strong>{selectedNode.templateName}</Text>
                  <br />
                  <Text type="secondary">{selectedNode.templateCode}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Workflow">
                <div>
                  <Text strong>{selectedNode.workflowName}</Text>
                  <br />
                  <Text type="secondary">{selectedNode.workflowCode}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Agent">
                <div>
                  <Text strong>{selectedNode.agentName}</Text>
                  <br />
                  <Text type="secondary">{selectedNode.agentCode}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedNode.statusCode === "ACTIVE" ? "green" : "orange"
                  }
                >
                  {selectedNode.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedNode.description || (
                  <Text type="secondary">Chưa có mô tả</Text>
                )}
              </Descriptions.Item>
            </Descriptions>

            {selectedNode.info && (
              <Card title="Thông tin bổ sung" size="small">
                <Text>{selectedNode.info}</Text>
              </Card>
            )}

            {selectedNode.configuration && (
              <Card title="Cấu hình" size="small">
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 8,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {JSON.stringify(
                    JSON.parse(selectedNode.configuration || "{}"),
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
                  showEditModal(selectedNode);
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

export default NodePage;
