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
  Collapse,
  List,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ApartmentOutlined,
  SettingOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  IWorkflow,
  IWorkflowSearchParams,
} from "../../interface/workflow.interface";
import { INode } from "../../interface/node.interface";
import workflowApi from "../../apis/workflow/api.workflow";
import nodeApi from "../../apis/node/api.node";

const { Search, TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
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
    page: 0,
    size: 10,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [workflowNodes, setWorkflowNodes] = useState<{
    [key: string]: INode[];
  }>({});

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Hoạt động", color: "green" },
    { value: "INACTIVE", label: "Không hoạt động", color: "red" },
    { value: "DRAFT", label: "Bản nháp", color: "orange" },
    { value: "PUBLISHED", label: "Đã xuất bản", color: "blue" },
  ];

  const fetchWorkflows = async (params?: IWorkflowSearchParams) => {
    setLoading(true);
    try {
      const response = await workflowApi.getWorkflows({
        ...searchParams,
        ...params,
      });
      setWorkflows(response.content);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách workflow");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflowNodes = async (workflowCode: string) => {
    if (workflowNodes[workflowCode]) return;

    try {
      const nodes = await nodeApi.getNodesByWorkflow(workflowCode);
      setWorkflowNodes((prev) => ({
        ...prev,
        [workflowCode]: nodes,
      }));
    } catch (error) {
      message.error("Không thể tải danh sách node của workflow");
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, page: 0 };
    setSearchParams(newParams);
    fetchWorkflows(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = { ...searchParams, page: page - 1, size: pageSize || 10 };
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

  const handleDelete = async (id: number) => {
    try {
      await workflowApi.deleteWorkflow(id);
      message.success("Xóa workflow thành công");
      fetchWorkflows();
    } catch (error) {
      message.error("Không thể xóa workflow");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const workflowData = {
        ...values,
        statusName:
          statusOptions.find((s) => s.value === values.statusCode)?.label || "",
      };

      if (editingWorkflow) {
        await workflowApi.updateWorkflow(
          editingWorkflow.workflowId!,
          workflowData
        );
        message.success("Cập nhật workflow thành công");
      } else {
        await workflowApi.createWorkflow(workflowData);
        message.success("Tạo workflow thành công");
      }
      setModalVisible(false);
      fetchWorkflows();
    } catch (error) {
      message.error("Không thể lưu workflow");
    }
  };

  const onExpand = (expanded: boolean, record: IWorkflow) => {
    if (expanded) {
      setExpandedRowKeys((prev) => [...prev, record.workflowCode]);
      fetchWorkflowNodes(record.workflowCode);
    } else {
      setExpandedRowKeys((prev) =>
        prev.filter((key) => key !== record.workflowCode)
      );
    }
  };

  const expandedRowRender = (record: IWorkflow) => {
    const nodes = workflowNodes[record.workflowCode] || [];

    return (
      <div
        style={{ padding: "16px", background: "#fafafa", borderRadius: "6px" }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space style={{ marginBottom: "12px" }}>
              <Text strong>Danh sách Node trong Workflow:</Text>
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
          <Text type="secondary">Chưa có node nào trong workflow này</Text>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: "Mã Workflow",
      dataIndex: "workflowCode",
      key: "workflowCode",
      width: 150,
    },
    {
      title: "Tên Workflow",
      dataIndex: "workflowName",
      key: "workflowName",
      width: 250,
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: any, record: IWorkflow) => (
        <Space size="small">
          <Button
            type="text"
            icon={<ApartmentOutlined />}
            onClick={() =>
              window.open(`/workflow-designer/${record.workflowCode}`, "_blank")
            }
            size="small"
            title="Thiết kế workflow"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa workflow này?"
            onConfirm={() => handleDelete(record.workflowId!)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              title="Xóa"
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
                Quản lý Workflow
              </Space>
            }
            extra={
              <Space>
                <Link to="/workflow-designer">
                  <Button icon={<SettingOutlined />}>Thiết kế Workflow</Button>
                </Link>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchWorkflows()}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm Workflow
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Tìm kiếm workflow..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={workflows}
              rowKey="workflowId"
              loading={loading}
              expandable={{
                expandedRowRender,
                onExpand,
                expandIcon: ({ expanded, onExpand, record }) => (
                  <Button
                    type="text"
                    icon={<NodeExpandOutlined />}
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
                  `${range[0]}-${range[1]} của ${total} bản ghi`,
                onChange: handleTableChange,
                onShowSizeChange: handleTableChange,
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingWorkflow ? "Sửa Workflow" : "Thêm Workflow"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="workflowCode"
                label="Mã Workflow"
                rules={[
                  { required: true, message: "Vui lòng nhập mã workflow" },
                ]}
              >
                <Input placeholder="Nhập mã workflow" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="workflowName"
                label="Tên Workflow"
                rules={[
                  { required: true, message: "Vui lòng nhập tên workflow" },
                ]}
              >
                <Input placeholder="Nhập tên workflow" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Nhập mô tả workflow" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkflowPage;
