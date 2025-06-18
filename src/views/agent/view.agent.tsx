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
import { IAgent, IAgentSearchParams } from "../../interface/agent.interface";
import agentApi from "../../apis/agent/api.agent";

const { Search } = Input;
const { Option } = Select;

const AgentPage: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<IAgent | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState<IAgentSearchParams>({
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
    { value: "PENDING", label: "Chờ xử lý", color: "orange" },
  ];

  const fetchAgents = async (params?: IAgentSearchParams) => {
    setLoading(true);
    try {
      const response = await agentApi.getAgents({ ...searchParams, ...params });
      setAgents(response.content);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách agent");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, page: 0 };
    setSearchParams(newParams);
    fetchAgents(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = { ...searchParams, page: page - 1, size: pageSize || 10 };
    setSearchParams(newParams);
    fetchAgents(newParams);
  };

  const handleCreate = () => {
    setEditingAgent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (agent: IAgent) => {
    setEditingAgent(agent);
    form.setFieldsValue(agent);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await agentApi.deleteAgent(id);
      message.success("Xóa agent thành công");
      fetchAgents();
    } catch (error) {
      message.error("Không thể xóa agent");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAgent) {
        await agentApi.updateAgent(editingAgent.agentId!, values);
        message.success("Cập nhật agent thành công");
      } else {
        await agentApi.createAgent(values);
        message.success("Tạo agent thành công");
      }
      setModalVisible(false);
      fetchAgents();
    } catch (error) {
      message.error("Không thể lưu agent");
    }
  };

  const columns = [
    {
      title: "Mã Agent",
      dataIndex: "agentCode",
      key: "agentCode",
      width: 150,
    },
    {
      title: "Tên Agent",
      dataIndex: "agentName",
      key: "agentName",
      width: 200,
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
      width: 150,
      render: (_: any, record: IAgent) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa agent này?"
            onConfirm={() => handleDelete(record.agentId!)}
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
            title="Quản lý Agent"
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={() => fetchAgents()}>
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm Agent
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Tìm kiếm agent..."
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
                  `${range[0]}-${range[1]} của ${total} bản ghi`,
                onChange: handleTableChange,
                onShowSizeChange: handleTableChange,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingAgent ? "Sửa Agent" : "Thêm Agent"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="agentCode"
                label="Mã Agent"
                rules={[{ required: true, message: "Vui lòng nhập mã agent" }]}
              >
                <Input placeholder="Nhập mã agent" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="agentName"
                label="Tên Agent"
                rules={[{ required: true, message: "Vui lòng nhập tên agent" }]}
              >
                <Input placeholder="Nhập tên agent" />
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
            <Col span={12}>
              <Form.Item name="statusName" label="Tên trạng thái">
                <Input placeholder="Nhập tên trạng thái" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentPage;
