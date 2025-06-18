import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Tag,
  theme,
  List,
  Typography,
  Badge,
  Progress,
  Statistic,
  Avatar,
  Tooltip,
  Divider,
  Drawer,
  Timeline,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ApartmentOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  BugOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  NodeExpandOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import type { ActionType } from "@ant-design/pro-components";
import {
  IWorkflow,
  IWorkflowSearchParams,
} from "../../interface/workflow.interface";
import workflowApi from "../../apis/workflow/api.workflow";
import { NotificationComponent } from "../../shared/components/notification/notification";

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

const WorkflowPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [testDrawerVisible, setTestDrawerVisible] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<IWorkflow | null>(
    null
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow | null>(
    null
  );
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorPrimary,
      colorSuccess,
      colorWarning,
      colorError,
      colorTextSecondary,
      boxShadowSecondary,
    },
  } = theme.useToken();

  const statusOptions = [
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "INACTIVE", label: "Inactive", color: "red" },
    { value: "DRAFT", label: "Draft", color: "orange" },
    { value: "PUBLISHED", label: "Published", color: "blue" },
  ];

  const fetchWorkflows = async (params?: IWorkflowSearchParams) => {
    try {
      const response = await workflowApi.getWorkflows({
        current: 1,
        pageSize: 1000,
        ...params,
      });

      setWorkflows(response.data || []);
      return {
        data: response.data || [],
        success: true,
        total: response.total || 0,
      };
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tải danh sách workflow",
      });
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const handleCreate = () => {
    setEditingWorkflow(null);
    form.resetFields();
    form.setFieldsValue({
      statusCode: "DRAFT",
    });
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
      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Xóa workflow thành công",
      });
      actionRef.current?.reload();
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể xóa workflow",
      });
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
        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: "Cập nhật workflow thành công",
        });
      } else {
        await workflowApi.createWorkflow(workflowData);
        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: "Tạo workflow thành công",
        });
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể lưu workflow",
      });
    }
  };

  const runWorkflowTest = async (workflow: IWorkflow) => {
    setSelectedWorkflow(workflow);
    setTestDrawerVisible(true);
    setTestRunning(true);
    setTestResults(null);

    try {
      // Mock test execution with realistic data
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResults = {
        workflowCode: workflow.workflowCode,
        workflowName: workflow.workflowName,
        status: Math.random() > 0.2 ? "success" : "failed",
        startTime: new Date(),
        endTime: new Date(Date.now() + Math.random() * 5000 + 1000),
        executionTime: Math.random() * 5000 + 1000,
        nodesExecuted: workflow.nodes?.length || 0,
        successfulNodes: Math.floor(
          (workflow.nodes?.length || 0) * (0.8 + Math.random() * 0.2)
        ),
        failedNodes: Math.ceil(
          (workflow.nodes?.length || 0) * Math.random() * 0.2
        ),
        logs: [
          {
            timestamp: new Date(),
            level: "info",
            message: `Starting workflow test for ${workflow.workflowCode}`,
            nodeId: null,
          },
          {
            timestamp: new Date(Date.now() + 500),
            level: "success",
            message: "Workflow validation passed",
            nodeId: null,
          },
          {
            timestamp: new Date(Date.now() + 1000),
            level: "info",
            message: "Executing node sequence",
            nodeId: "node_1",
          },
          {
            timestamp: new Date(Date.now() + 2000),
            level: "success",
            message: "Node execution completed successfully",
            nodeId: "node_1",
          },
          {
            timestamp: new Date(Date.now() + 2500),
            level: "info",
            message: "Processing connections",
            nodeId: null,
          },
          {
            timestamp: new Date(Date.now() + 3000),
            level: "success",
            message: "Workflow test completed",
            nodeId: null,
          },
        ],
        performance: {
          avgResponseTime: Math.random() * 1000 + 200,
          throughput: Math.random() * 100 + 50,
          errorRate: Math.random() * 5,
          successRate: 95 + Math.random() * 5,
        },
      };

      setTestResults(mockResults);

      NotificationComponent({
        type: mockResults.status === "success" ? "success" : "error",
        message: "Test hoàn thành",
        description: `Workflow test ${
          mockResults.status === "success" ? "thành công" : "thất bại"
        } trong ${(mockResults.executionTime / 1000).toFixed(2)}s`,
      });
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Test thất bại",
        description: "Có lỗi xảy ra trong quá trình test workflow",
      });
    } finally {
      setTestRunning(false);
    }
  };

  const columns: ProColumns<IWorkflow>[] = [
    {
      title: "Workflow Code",
      dataIndex: "workflowCode",
      key: "workflowCode",
      width: 180,
      fixed: "left",
      copyable: true,
      ellipsis: true,
    },
    {
      title: "Workflow Name",
      dataIndex: "workflowName",
      key: "workflowName",
      width: 220,
      ellipsis: true,
      render: (text: string, record) => (
        <div>
          <Text strong style={{ display: "block", fontSize: 14 }}>
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.workflowCode}
          </Text>
        </div>
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
          <Tag color={status.color} style={{ fontWeight: 500 }}>
            {status.label}
          </Tag>
        ) : (
          <Tag>{statusCode}</Tag>
        );
      },
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.statusCode === value,
    },
    {
      title: "Nodes",
      key: "nodeCount",
      width: 100,
      render: (_: any, record: IWorkflow) => (
        <Space>
          <Avatar
            size="small"
            icon={<NodeExpandOutlined />}
            style={{ backgroundColor: colorPrimary }}
          />
          <Badge
            count={record.nodes?.length || 0}
            overflowCount={99}
            style={{ backgroundColor: colorSuccess }}
          />
        </Space>
      ),
    },
    {
      title: "Performance",
      key: "performance",
      width: 120,
      render: (_: any, record: IWorkflow) => {
        const successRate = 85 + Math.random() * 15; // Mock data
        return (
          <div style={{ textAlign: "center" }}>
            <Progress
              type="circle"
              size={40}
              percent={Math.round(successRate)}
              strokeColor={
                successRate >= 95
                  ? colorSuccess
                  : successRate >= 80
                  ? colorWarning
                  : colorError
              }
              format={(percent) => `${percent}%`}
            />
          </div>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) =>
        text || <Text type="secondary">Không có mô tả</Text>,
    },
    {
      title: "Actions",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_: any, record: IWorkflow) => (
        <Space size="small" wrap>
          <Tooltip title="Thiết kế workflow">
            <Button
              type="text"
              icon={<ApartmentOutlined />}
              onClick={() =>
                window.open(
                  `/workflow-builder?workflow=${record.workflowCode}`,
                  "_blank"
                )
              }
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chạy test">
            <Button
              type="text"
              icon={<ThunderboltOutlined />}
              onClick={() => runWorkflowTest(record)}
              size="small"
              style={{ color: colorSuccess }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận xóa",
                  content: `Bạn có chắc muốn xóa workflow "${record.workflowName}"?`,
                  onOk: () => handleDelete(record.workflowCode),
                  okText: "Xóa",
                  cancelText: "Hủy",
                  okButtonProps: { danger: true },
                });
              }}
              danger
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: IWorkflow) => {
    const nodes = record.nodes || [];

    return (
      <div
        style={{
          padding: "20px",
          background: `${colorPrimary}05`,
          borderRadius: borderRadiusLG,
          border: `1px solid ${colorPrimary}20`,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space style={{ marginBottom: "16px" }}>
              <NodeExpandOutlined style={{ color: colorPrimary }} />
              <Text strong>Nodes trong Workflow:</Text>
              <Badge
                count={nodes.length}
                style={{ backgroundColor: colorPrimary }}
              />
            </Space>
          </Col>
        </Row>

        {nodes.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={nodes}
            renderItem={(node) => (
              <List.Item>
                <Card
                  size="small"
                  style={{
                    borderRadius: borderRadiusLG,
                    border: `1px solid ${colorPrimary}30`,
                    background: colorBgContainer,
                  }}
                  hoverable
                >
                  <Space
                    direction="vertical"
                    size={6}
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Avatar size="small" icon={<ApiOutlined />} />
                      <Text strong style={{ fontSize: 13 }}>
                        {node.nodeName}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {node.nodeCode}
                    </Text>
                    <div>
                      <Text style={{ fontSize: "11px", display: "block" }}>
                        Template: <Text code>{node.templateName}</Text>
                      </Text>
                      <Text style={{ fontSize: "11px", display: "block" }}>
                        Agent: <Text code>{node.agentName}</Text>
                      </Text>
                    </div>
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
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: colorTextSecondary,
            }}
          >
            <NodeExpandOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <br />
            <Text type="secondary">Chưa có node nào trong workflow này</Text>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 16,
        background: "transparent",
        minHeight: "100%",
      }}
    >
      <Card
        title={
          <Space>
            <ApartmentOutlined style={{ color: colorPrimary }} />
            <span>Quản lý Workflow</span>
            <Badge count={workflows.length} />
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => actionRef.current?.reload()}
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
        style={{
          borderRadius: borderRadiusLG,
          boxShadow: boxShadowSecondary,
        }}
      >
        <ProTable<IWorkflow>
          columns={columns}
          actionRef={actionRef}
          request={fetchWorkflows}
          rowKey="workflowCode"
          search={{
            labelWidth: "auto",
            defaultCollapsed: false,
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          expandable={{
            expandedRowRender,
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                onClick={(e) => onExpand(record, e)}
                style={{
                  color: expanded ? colorPrimary : colorTextSecondary,
                  transform: expanded ? "rotate(0deg)" : "rotate(0deg)",
                  transition: "all 0.2s",
                }}
              />
            ),
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} mục`,
          }}
          scroll={{ x: 1400 }}
          size="small"
        />
      </Card>

      {/* Workflow Form Modal */}
      <Modal
        title={
          <Space>
            <ApartmentOutlined />
            {editingWorkflow ? "Chỉnh sửa Workflow" : "Thêm Workflow"}
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        destroyOnHidden
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
                <Input
                  placeholder="Nhập mã workflow"
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
                    <Select.Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="version" label="Phiên bản">
                <Input placeholder="v1.0.0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Nhập mô tả workflow" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Test Results Drawer */}
      <Drawer
        title={
          <Space>
            <ThunderboltOutlined style={{ color: colorSuccess }} />
            <span>Kết quả Test Workflow</span>
            {selectedWorkflow && (
              <Tag color="blue">{selectedWorkflow.workflowCode}</Tag>
            )}
          </Space>
        }
        open={testDrawerVisible}
        onClose={() => setTestDrawerVisible(false)}
        width={600}
      >
        {testRunning ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
            <Title
              level={4}
              style={{ marginTop: 20, color: colorTextSecondary }}
            >
              Đang chạy test workflow...
            </Title>
            <Text type="secondary">Vui lòng đợi trong giây lát</Text>
          </div>
        ) : testResults ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Test Summary */}
            <Card
              title="Tóm tắt Test"
              size="small"
              style={{ borderRadius: borderRadiusLG }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Thời gian thực thi"
                    value={(testResults.executionTime / 1000).toFixed(2)}
                    suffix="s"
                    valueStyle={{
                      color:
                        testResults.status === "success"
                          ? colorSuccess
                          : colorError,
                    }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Trạng thái"
                    value={
                      testResults.status === "success"
                        ? "Thành công"
                        : "Thất bại"
                    }
                    valueStyle={{
                      color:
                        testResults.status === "success"
                          ? colorSuccess
                          : colorError,
                    }}
                    prefix={
                      testResults.status === "success" ? (
                        <CheckCircleOutlined />
                      ) : (
                        <ExclamationCircleOutlined />
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Nodes thành công"
                    value={testResults.successfulNodes}
                    suffix={`/${testResults.nodesExecuted}`}
                    valueStyle={{ color: colorSuccess }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Nodes thất bại"
                    value={testResults.failedNodes}
                    suffix={`/${testResults.nodesExecuted}`}
                    valueStyle={{
                      color:
                        testResults.failedNodes > 0 ? colorError : colorSuccess,
                    }}
                  />
                </Col>
              </Row>

              <Divider />

              <Progress
                percent={Math.round(
                  (testResults.successfulNodes / testResults.nodesExecuted) *
                    100
                )}
                strokeColor={
                  testResults.failedNodes === 0
                    ? colorSuccess
                    : testResults.failedNodes <= 1
                    ? colorWarning
                    : colorError
                }
                size="small"
              />
            </Card>

            {/* Performance Metrics */}
            <Card
              title="Hiệu suất"
              size="small"
              style={{ borderRadius: borderRadiusLG }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Tỷ lệ thành công"
                    value={testResults.performance.successRate.toFixed(1)}
                    suffix="%"
                    valueStyle={{ color: colorSuccess }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Thời gian phản hồi TB"
                    value={testResults.performance.avgResponseTime.toFixed(0)}
                    suffix="ms"
                    valueStyle={{ color: colorPrimary }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Throughput"
                    value={testResults.performance.throughput.toFixed(1)}
                    suffix="req/s"
                    valueStyle={{ color: colorWarning }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Tỷ lệ lỗi"
                    value={testResults.performance.errorRate.toFixed(2)}
                    suffix="%"
                    valueStyle={{ color: colorError }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Test Logs */}
            <Card
              title="Log Test"
              size="small"
              style={{ borderRadius: borderRadiusLG }}
            >
              <Timeline
                items={testResults.logs.map((log: any, index: number) => ({
                  key: index,
                  color:
                    log.level === "success"
                      ? colorSuccess
                      : log.level === "error"
                      ? colorError
                      : log.level === "warning"
                      ? colorWarning
                      : colorPrimary,
                  children: (
                    <div>
                      <Text strong style={{ fontSize: 13 }}>
                        {log.message}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {log.timestamp.toLocaleTimeString()}
                        {log.nodeId && ` • Node: ${log.nodeId}`}
                      </Text>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Space>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <BugOutlined
              style={{
                fontSize: 48,
                color: colorTextSecondary,
                marginBottom: 20,
              }}
            />
            <Title level={4} style={{ color: colorTextSecondary }}>
              Chưa có kết quả test
            </Title>
            <Text type="secondary">Vui lòng chạy test để xem kết quả</Text>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default WorkflowPage;
