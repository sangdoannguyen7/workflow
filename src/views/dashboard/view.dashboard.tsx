import {
  Card,
  Col,
  Row,
  Statistic,
  Progress,
  List,
  Tag,
  Typography,
  Space,
  Divider,
  Timeline,
  Table,
  Badge,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RobotOutlined,
  FileTextOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";
import ApiHealthCheck from "../../shared/components/api-health.component";
import { useEffect, useState } from "react";
import { getEnhancedMockWorkflows } from "../../mock/enhanced-workflow.mock";
import { getMockNodes } from "../../mock/node.mock";
import { getMockAgents } from "../../mock/agent.mock";
import { getMockTemplates } from "../../mock/template.mock";
import WorkflowPerformanceChart from "../../shared/components/charts/workflow-performance.component";
import WorkflowStatusChart from "../../shared/components/charts/workflow-status.component";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface DashboardStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalNodes: number;
  totalAgents: number;
  totalTemplates: number;
  executionRate: number;
  successRate: number;
  averageExecutionTime: number;
}

interface WorkflowExecution {
  id: string;
  workflowName: string;
  status: "running" | "completed" | "failed" | "pending";
  startTime: string;
  duration?: number;
  progress: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalNodes: 0,
    totalAgents: 0,
    totalTemplates: 0,
    executionRate: 0,
    successRate: 0,
    averageExecutionTime: 0,
  });

  const [recentExecutions, setRecentExecutions] = useState<WorkflowExecution[]>(
    []
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load mock data
    const workflows = getEnhancedMockWorkflows();
    const nodes = getMockNodes();
    const agents = getMockAgents();
    const templates = getMockTemplates();

    const activeWorkflows = workflows.content.filter(
      (w) => w.statusCode === "ACTIVE"
    ).length;

    setStats({
      totalWorkflows: workflows.totalElements,
      activeWorkflows,
      totalNodes: nodes.totalElements,
      totalAgents: agents.totalElements,
      totalTemplates: templates.totalElements,
      executionRate: 87.5,
      successRate: 94.2,
      averageExecutionTime: 1250,
    });

    // Generate mock recent executions
    setRecentExecutions([
      {
        id: "exec-1",
        workflowName: "Hotel Booking Workflow",
        status: "completed",
        startTime: dayjs().subtract(5, "minutes").format("HH:mm:ss"),
        duration: 1200,
        progress: 100,
      },
      {
        id: "exec-2",
        workflowName: "Daily Report Workflow",
        status: "running",
        startTime: dayjs().subtract(2, "minutes").format("HH:mm:ss"),
        progress: 65,
      },
      {
        id: "exec-3",
        workflowName: "Payment Processing",
        status: "failed",
        startTime: dayjs().subtract(8, "minutes").format("HH:mm:ss"),
        duration: 800,
        progress: 45,
      },
      {
        id: "exec-4",
        workflowName: "Data Synchronization",
        status: "pending",
        startTime: dayjs().subtract(1, "minutes").format("HH:mm:ss"),
        progress: 0,
      },
    ]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <PlayCircleOutlined style={{ color: "#1890ff" }} />;
      case "completed":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "failed":
        return <WarningOutlined style={{ color: "#ff4d4f" }} />;
      case "pending":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      default:
        return <PauseCircleOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "processing";
      case "completed":
        return "success";
      case "failed":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const executionColumns = [
    {
      title: "Workflow",
      dataIndex: "workflowName",
      key: "workflowName",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <Progress
          percent={progress}
          size="small"
          strokeColor={progress === 100 ? "#52c41a" : "#1890ff"}
          showInfo={false}
        />
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (duration ? `${duration}ms` : "-"),
    },
  ];

  return (
    <div>
      <ApiHealthCheck />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Workflow Dashboard
        </Title>
        <Text type="secondary">Monitor and manage your workflow ecosystem</Text>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Workflows"
              value={stats.totalWorkflows}
              prefix={<NodeExpandOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Workflows"
              value={stats.activeWorkflows}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={stats.successRate}
              precision={1}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Execution Rate"
              value={stats.executionRate}
              precision={1}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* System Overview */}
        <Col xs={24} lg={12}>
          <Card title="System Overview" bordered={false}>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontSize: 32, color: "#1890ff", marginBottom: 8 }}
                  >
                    <RobotOutlined />
                  </div>
                  <Statistic
                    title="Agents"
                    value={stats.totalAgents}
                    valueStyle={{ fontSize: 24, color: "#1890ff" }}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontSize: 32, color: "#52c41a", marginBottom: 8 }}
                  >
                    <FileTextOutlined />
                  </div>
                  <Statistic
                    title="Templates"
                    value={stats.totalTemplates}
                    valueStyle={{ fontSize: 24, color: "#52c41a" }}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontSize: 32, color: "#fa8c16", marginBottom: 8 }}
                  >
                    <NodeExpandOutlined />
                  </div>
                  <Statistic
                    title="Nodes"
                    value={stats.totalNodes}
                    valueStyle={{ fontSize: 24, color: "#fa8c16" }}
                  />
                </div>
              </Col>
            </Row>

            <Divider />

            <div style={{ marginTop: 16 }}>
              <Text strong>Average Execution Time</Text>
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={75}
                  format={() => `${stats.averageExecutionTime}ms`}
                  strokeColor={{
                    "0%": "#87d068",
                    "50%": "#ffe58f",
                    "100%": "#ffccc7",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* Workflow Status Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Workflow Status Distribution" bordered={false}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Active</Text>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Progress
                    percent={65}
                    showInfo={false}
                    strokeColor="#52c41a"
                    trailColor="#f5f5f5"
                    style={{ width: 100 }}
                  />
                  <Text strong style={{ color: "#52c41a" }}>
                    {stats.activeWorkflows}
                  </Text>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Draft</Text>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Progress
                    percent={20}
                    showInfo={false}
                    strokeColor="#faad14"
                    trailColor="#f5f5f5"
                    style={{ width: 100 }}
                  />
                  <Text strong style={{ color: "#faad14" }}>
                    1
                  </Text>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Inactive</Text>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Progress
                    percent={15}
                    showInfo={false}
                    strokeColor="#ff4d4f"
                    trailColor="#f5f5f5"
                    style={{ width: 100 }}
                  />
                  <Text strong style={{ color: "#ff4d4f" }}>
                    1
                  </Text>
                </div>
              </div>
            </Space>

            <Divider />

            <Timeline size="small">
              <Timeline.Item color="green">
                <Text strong>Hotel Booking</Text> workflow activated
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  2 minutes ago
                </Text>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text strong>Report Generation</Text> completed successfully
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  5 minutes ago
                </Text>
              </Timeline.Item>
              <Timeline.Item color="red">
                <Text strong>Payment Processing</Text> failed execution
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  8 minutes ago
                </Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Recent Executions */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Recent Workflow Executions" bordered={false}>
            <Table
              dataSource={recentExecutions}
              columns={executionColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
