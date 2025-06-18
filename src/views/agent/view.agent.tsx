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
  RobotOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import agentApi from "../../apis/agent/api.agent";
import { IAgent } from "../../interface/agent.interface";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AgentPage: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<IAgent | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<IAgent | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // Load agents
  const loadAgents = async (params?: any) => {
    setLoading(true);
    try {
      const response = await agentApi.getAgents({
        ...params,
        search: searchText,
        statusCode: statusFilter,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      setAgents(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách agent");
    } finally {
      setLoading(false);
    }
  };

  // Handle create/update agent
  const handleSave = async (values: any) => {
    try {
      const agentData = {
        ...values,
        search:
          `${values.agentName} ${values.description} ${values.statusName}`.toLowerCase(),
      };

      if (editingAgent) {
        await agentApi.updateAgent(editingAgent.agentCode, agentData);
        message.success("Cập nhật agent thành công");
      } else {
        await agentApi.createAgent(agentData);
        message.success("Tạo agent thành công");
      }

      setIsModalVisible(false);
      setEditingAgent(null);
      form.resetFields();
      loadAgents();
    } catch (error) {
      message.error("Lỗi khi lưu agent");
    }
  };

  // Handle delete agent
  const handleDelete = async (agentCode: string) => {
    try {
      await agentApi.deleteAgent(agentCode);
      message.success("Xóa agent thành công");
      loadAgents();
    } catch (error) {
      message.error("Lỗi khi xóa agent");
    }
  };

  // Show create modal
  const showCreateModal = () => {
    setEditingAgent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show edit modal
  const showEditModal = (agent: IAgent) => {
    setEditingAgent(agent);
    form.setFieldsValue(agent);
    setIsModalVisible(true);
  };

  // Show detail drawer
  const showDetail = (agent: IAgent) => {
    setSelectedAgent(agent);
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
  const columns: ColumnsType<IAgent> = [
    {
      title: "Agent Code",
      dataIndex: "agentCode",
      key: "agentCode",
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: "Tên Agent",
      dataIndex: "agentName",
      key: "agentName",
      ellipsis: true,
      render: (text) => (
        <Space>
          <RobotOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
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
            title="Bạn có chắc muốn xóa agent này?"
            onConfirm={() => handleDelete(record.agentCode)}
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
    loadAgents();
  }, [searchText, statusFilter, pagination.current, pagination.pageSize]);

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              <RobotOutlined /> Quản lý Agent
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Tạo Agent
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm agent..."
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
            <Button icon={<ReloadOutlined />} onClick={() => loadAgents()}>
              Làm mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={agents}
          rowKey="agentCode"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} agent`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingAgent ? "Chỉnh sửa Agent" : "Tạo Agent mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAgent(null);
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
                name="agentCode"
                label="Agent Code"
                rules={[
                  { required: true, message: "Vui lòng nhập agent code" },
                ]}
              >
                <Input
                  placeholder="VD: WEBHOOK_AGENT"
                  disabled={!!editingAgent}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="agentName"
                label="Tên Agent"
                rules={[{ required: true, message: "Vui lòng nhập tên agent" }]}
              >
                <Input placeholder="VD: Webhook Processing Agent" />
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
            <TextArea rows={4} placeholder="Mô tả chi tiết về agent..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAgent ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingAgent(null);
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
        title="Chi tiết Agent"
        placement="right"
        width={500}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedAgent && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="Agent Code">
                <Text code>{selectedAgent.agentCode}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên Agent">
                <Space>
                  <RobotOutlined style={{ color: "#1890ff" }} />
                  <Text strong>{selectedAgent.agentName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedAgent.statusCode === "ACTIVE" ? "green" : "orange"
                  }
                >
                  {selectedAgent.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedAgent.description || (
                  <Text type="secondary">Chưa có mô tả</Text>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsDetailVisible(false);
                  showEditModal(selectedAgent);
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

export default AgentPage;
