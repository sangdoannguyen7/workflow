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
  ApartmentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import workflowApi from "../../apis/workflow/api.workflow";
import { IWorkflow } from "../../interface/workflow.interface";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const WorkflowPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<IWorkflow | null>(
    null
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // Load workflows
  const loadWorkflows = async (params?: any) => {
    setLoading(true);
    try {
      const response = await workflowApi.getWorkflows({
        ...params,
        search: searchText,
        statusCode: statusFilter,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      setWorkflows(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách workflow");
    } finally {
      setLoading(false);
    }
  };

  // Handle create/update workflow
  const handleSave = async (values: any) => {
    try {
      const workflowData = {
        ...values,
        search:
          `${values.workflowName} ${values.description} ${values.statusName}`.toLowerCase(),
      };

      if (editingWorkflow) {
        await workflowApi.updateWorkflow(
          editingWorkflow.workflowCode,
          workflowData
        );
        message.success("Cập nhật workflow thành công");
      } else {
        await workflowApi.createWorkflow(workflowData);
        message.success("Tạo workflow thành công");
      }

      setIsModalVisible(false);
      setEditingWorkflow(null);
      form.resetFields();
      loadWorkflows();
    } catch (error) {
      message.error("Lỗi khi lưu workflow");
    }
  };

  // Handle delete workflow
  const handleDelete = async (workflowCode: string) => {
    try {
      await workflowApi.deleteWorkflow(workflowCode);
      message.success("Xóa workflow thành công");
      loadWorkflows();
    } catch (error) {
      message.error("Lỗi khi xóa workflow");
    }
  };

  // Show create modal
  const showCreateModal = () => {
    setEditingWorkflow(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show edit modal
  const showEditModal = (workflow: IWorkflow) => {
    setEditingWorkflow(workflow);
    form.setFieldsValue(workflow);
    setIsModalVisible(true);
  };

  // Show detail drawer
  const showDetail = (workflow: IWorkflow) => {
    setSelectedWorkflow(workflow);
    setIsDetailVisible(true);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
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
  const columns: ColumnsType<IWorkflow> = [
    {
      title: "Workflow Code",
      dataIndex: "workflowCode",
      key: "workflowCode",
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: "Tên Workflow",
      dataIndex: "workflowName",
      key: "workflowName",
      ellipsis: true,
      render: (text) => <Text strong>{text}</Text>,
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
      title: "Số Nodes",
      dataIndex: "nodes",
      key: "nodeCount",
      width: 100,
      render: (nodes) => <Tag>{nodes?.length || 0} nodes</Tag>,
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
            title="Bạn có chắc muốn xóa workflow này?"
            onConfirm={() => handleDelete(record.workflowCode)}
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
    loadWorkflows();
  }, [searchText, statusFilter, pagination.current, pagination.pageSize]);

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              <ApartmentOutlined /> Quản lý Workflow
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Tạo Workflow
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm workflow..."
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={handleFilterChange}
            >
              <Option value="">Tất cả</Option>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Không hoạt động</Option>
              <Option value="DRAFT">Bản nháp</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => loadWorkflows()}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={workflows}
          rowKey="workflowCode"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} workflow`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingWorkflow ? "Chỉnh sửa Workflow" : "Tạo Workflow mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingWorkflow(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
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
                name="workflowCode"
                label="Workflow Code"
                rules={[
                  { required: true, message: "Vui lòng nhập workflow code" },
                ]}
              >
                <Input
                  placeholder="VD: BOOKING_FLOW"
                  disabled={!!editingWorkflow}
                />
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
                <Input placeholder="VD: Quy trình đặt phòng" />
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
                <Select>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Không hoạt động</Option>
                  <Option value="DRAFT">Bản nháp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
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

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              rows={4}
              placeholder="Mô tả chi tiết về workflow..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingWorkflow ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingWorkflow(null);
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
        title="Chi tiết Workflow"
        placement="right"
        width={500}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedWorkflow && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="Workflow Code">
                <Text code>{selectedWorkflow.workflowCode}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Workflow">
                <Text strong>{selectedWorkflow.workflowName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedWorkflow.statusCode === "ACTIVE"
                      ? "green"
                      : "orange"
                  }
                >
                  {selectedWorkflow.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedWorkflow.description || (
                  <Text type="secondary">Chưa có mô tả</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số Nodes">
                <Tag>{selectedWorkflow.nodes?.length || 0} nodes</Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedWorkflow.nodes && selectedWorkflow.nodes.length > 0 && (
              <Card title="Danh sách Nodes" size="small">
                {selectedWorkflow.nodes.map((node, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <Text strong>{node.nodeName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {node.nodeCode} • {node.templateCode}
                    </Text>
                  </div>
                ))}
              </Card>
            )}

            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsDetailVisible(false);
                  showEditModal(selectedWorkflow);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button
                icon={<ApartmentOutlined />}
                onClick={() => {
                  window.open(
                    `/workflow-builder?workflow=${selectedWorkflow.workflowCode}`,
                    "_blank"
                  );
                }}
              >
                Thiết kế Workflow
              </Button>
            </Space>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default WorkflowPage;
