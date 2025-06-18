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
} from "@ant-design/icons";
import {
  ITemplate,
  ITemplateSearchParams,
} from "../../interface/template.interface";
import { IAgent } from "../../interface/agent.interface";
import templateApi from "../../apis/template/api.template";
import agentApi from "../../apis/agent/api.agent";

const { Search, TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

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
    { value: "DRAFT", label: "Bản nháp", color: "orange" },
  ];

  const templateTypeOptions = [
    { value: "INPUT", label: "Input Template" },
    { value: "OUTPUT", label: "Output Template" },
    { value: "PROCESS", label: "Process Template" },
  ];

  const fetchTemplates = async (params?: ITemplateSearchParams) => {
    setLoading(true);
    try {
      const response = await templateApi.getTemplates({
        ...searchParams,
        ...params,
      });
      setTemplates(response.content);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách template");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await agentApi.getAgents({ size: 1000 });
      setAgents(response.content);
    } catch (error) {
      message.error("Không thể tải danh sách agent");
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchAgents();
  }, []);

  const handleSearch = (value: string) => {
    const newParams = { ...searchParams, search: value, page: 0 };
    setSearchParams(newParams);
    fetchTemplates(newParams);
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newParams = { ...searchParams, page: page - 1, size: pageSize || 10 };
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
      message.success("Xóa template thành công");
      fetchTemplates();
    } catch (error) {
      message.error("Không thể xóa template");
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
          editingTemplate.templateId!,
          templateData
        );
        message.success("Cập nhật template thành công");
      } else {
        await templateApi.createTemplate(templateData);
        message.success("Tạo template thành công");
      }
      setModalVisible(false);
      fetchTemplates();
    } catch (error) {
      message.error("Không thể lưu template");
    }
  };

  const columns = [
    {
      title: "Mã Template",
      dataIndex: "templateCode",
      key: "templateCode",
      width: 150,
    },
    {
      title: "Tên Template",
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
      title: "Loại",
      dataIndex: "templateType",
      key: "templateType",
      width: 120,
      render: (type: string) => {
        const typeOption = templateTypeOptions.find((t) => t.value === type);
        return typeOption ? typeOption.label : type;
      },
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
      render: (_: any, record: ITemplate) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa template này?"
            onConfirm={() => handleDelete(record.templateId!)}
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
            title="Quản lý Template"
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchTemplates()}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm Template
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Tìm kiếm template..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
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
                  `${range[0]}-${range[1]} của ${total} bản ghi`,
                onChange: handleTableChange,
                onShowSizeChange: handleTableChange,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingTemplate ? "Sửa Template" : "Thêm Template"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông tin chính" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="templateCode"
                    label="Mã Template"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã template" },
                    ]}
                  >
                    <Input placeholder="Nhập mã template" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="templateName"
                    label="Tên Template"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên template" },
                    ]}
                  >
                    <Input placeholder="Nhập tên template" />
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
                    <Select placeholder="Chọn agent">
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
                    name="templateType"
                    label="Loại Template"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại template",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại template">
                      {templateTypeOptions.map((option) => (
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
                  <Form.Item name="typeCode" label="Mã loại">
                    <Input placeholder="Nhập mã loại" />
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

export default TemplatePage;
