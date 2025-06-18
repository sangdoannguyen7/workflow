import { useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Statistic,
  theme,
  Space,
  Typography,
  Progress,
  Tag,
  Divider,
  Avatar,
  List,
  Input,
  Tooltip,
  Badge,
  Alert,
} from "antd";
import {
  SearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  TrophyOutlined,
  TeamOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Pie, Area, Gauge } from "@ant-design/plots";
import dayjs from "dayjs";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);
  const [selectedWorkflow, setSelectedWorkflow] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorPrimary,
      colorSuccess,
      colorWarning,
      colorError,
      colorTextSecondary,
      colorText,
      boxShadowSecondary,
      colorInfo,
    },
  } = theme.useToken();

  // Enhanced mock data
  const [dashboardData] = useState({
    stats: {
      totalWorkflows: 128,
      activeWorkflows: 89,
      successRate: 98.5,
      avgResponseTime: 2.8,
      todayErrors: 7,
      totalExecutions: 15420,
      totalAgents: 24,
      onlineAgents: 22,
    },
    executionTrend: [
      { date: "2024-01-01", executions: 120, success: 110, failed: 10 },
      { date: "2024-01-02", executions: 150, success: 140, failed: 10 },
      { date: "2024-01-03", executions: 180, success: 165, failed: 15 },
      { date: "2024-01-04", executions: 200, success: 185, failed: 15 },
      { date: "2024-01-05", executions: 160, success: 145, failed: 15 },
      { date: "2024-01-06", executions: 220, success: 200, failed: 20 },
      { date: "2024-01-07", executions: 190, success: 175, failed: 15 },
    ],
    workflowTypes: [
      { type: "Webhook", count: 45, percentage: 35, color: "#52c41a" },
      { type: "Schedule", count: 30, percentage: 25, color: "#1890ff" },
      { type: "REST API", count: 25, percentage: 20, color: "#fa8c16" },
      { type: "Process", count: 20, percentage: 15, color: "#722ed1" },
      { type: "Other", count: 8, percentage: 5, color: "#eb2f96" },
    ],
    topWorkflows: [
      {
        name: "User Registration Flow",
        executions: 1250,
        success_rate: 98.5,
        trend: "up",
      },
      {
        name: "Payment Processing",
        executions: 890,
        success_rate: 99.2,
        trend: "up",
      },
      {
        name: "Email Campaign",
        executions: 756,
        success_rate: 97.8,
        trend: "down",
      },
      {
        name: "Data Backup",
        executions: 124,
        success_rate: 100,
        trend: "stable",
      },
      {
        name: "Report Generation",
        executions: 89,
        success_rate: 96.5,
        trend: "up",
      },
    ],
    recentActivities: [
      {
        id: 1,
        type: "success",
        title: 'Workflow "Data Sync" hoàn thành',
        description: "Đã xử lý 1,234 records thành công",
        time: "2 phút trước",
        user: "System",
        workflow: "DATA_SYNC",
      },
      {
        id: 2,
        type: "warning",
        title: 'Agent "Email Service" chậm phản hồi',
        description: "Thời gian phản hồi trung bình: 5.2s",
        time: "15 phút trước",
        user: "Monitor",
        workflow: "EMAIL_SERVICE",
      },
      {
        id: 3,
        type: "info",
        title: "Template mới được tạo",
        description: 'Template "Payment Notification" đã được thêm',
        time: "1 giờ trước",
        user: "Admin",
        workflow: "PAYMENT_NOTIFY",
      },
      {
        id: 4,
        type: "success",
        title: 'Node "Validation" đã cập nhật',
        description: "Thêm rule validation mới cho email format",
        time: "2 giờ trước",
        user: "Developer",
        workflow: "VALIDATION",
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "Hệ thống sẽ bảo trì vào Chủ nhật 2:00 - 4:00 AM",
        showIcon: true,
        closable: true,
      },
      {
        type: "info",
        message: "Phiên bản v2.1.0 đã được phát hành với nhiều tính năng mới",
        showIcon: true,
        closable: true,
      },
    ],
  });

  // Chart configurations
  const executionAreaConfig = {
    data: dashboardData.executionTrend,
    xField: "date",
    yField: "executions",
    smooth: true,
    color: colorPrimary,
    areaStyle: {
      fill: `l(270) 0:${colorPrimary}40 0.5:${colorPrimary}20 1:${colorPrimary}10`,
    },
    line: {
      color: colorPrimary,
      size: 3,
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: colorPrimary,
        stroke: "#fff",
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: "Executions",
        value: datum.executions.toLocaleString(),
      }),
    },
  };

  const typeDistributionConfig = {
    data: dashboardData.workflowTypes,
    angleField: "count",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    color: dashboardData.workflowTypes.map((t) => t.color),
    label: {
      type: "spider",
      labelHeight: 40,
      formatter: (data: any) => `${data.type}: ${data.percentage}%`,
      style: {
        fontSize: 12,
        fontWeight: 500,
      },
    },
    statistic: {
      title: {
        formatter: () => "Total",
      },
      content: {
        formatter: () => "128",
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.count} (${datum.percentage}%)`,
      }),
    },
  };

  const performanceGaugeConfig = {
    percent: dashboardData.stats.successRate / 100,
    color: {
      range: [colorError, colorWarning, colorSuccess],
      rangeColors: [colorError, colorWarning, colorSuccess],
    },
    indicator: {
      pointer: {
        style: {
          stroke: colorPrimary,
        },
      },
      pin: {
        style: {
          stroke: colorPrimary,
        },
      },
    },
    statistic: {
      content: {
        formatter: () => `${dashboardData.stats.successRate}%`,
      },
    },
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleSearch = () => {
    setLoading(true);
    // Simulate search
    setTimeout(() => setLoading(false), 500);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpOutlined style={{ color: colorSuccess }} />;
      case "down":
        return <ArrowDownOutlined style={{ color: colorError }} />;
      default:
        return <SyncOutlined style={{ color: colorWarning }} />;
    }
  };

  const getActivityIcon = (type: string) => {
    const iconStyle = { fontSize: 16 };
    switch (type) {
      case "success":
        return (
          <CheckCircleOutlined style={{ ...iconStyle, color: colorSuccess }} />
        );
      case "warning":
        return (
          <ExclamationCircleOutlined
            style={{ ...iconStyle, color: colorWarning }}
          />
        );
      case "error":
        return (
          <CloseCircleOutlined style={{ ...iconStyle, color: colorError }} />
        );
      case "info":
      default:
        return (
          <InfoCircleOutlined style={{ ...iconStyle, color: colorInfo }} />
        );
    }
  };

  return (
    <div
      style={{
        padding: 16,
        background: "transparent",
        minHeight: "100%",
      }}
    >
      {/* Alerts */}
      {dashboardData.alerts.map((alert, index) => (
        <Alert
          key={index}
          message={alert.message}
          type={alert.type as any}
          showIcon={alert.showIcon}
          closable={alert.closable}
          style={{
            marginBottom: 16,
            borderRadius: borderRadiusLG,
            border: "none",
          }}
        />
      ))}

      {/* Enhanced Filter Section */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: borderRadiusLG,
          boxShadow: boxShadowSecondary,
          background: `linear-gradient(135deg, ${colorPrimary}08, ${colorPrimary}03)`,
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text strong style={{ fontSize: 13, color: colorText }}>
                <ClockCircleOutlined
                  style={{ marginRight: 6, color: colorPrimary }}
                />
                Khoảng thời gian
              </Text>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange((dates as any) || [])}
                format="DD/MM/YYYY"
                allowClear={false}
                style={{ width: "100%" }}
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text strong style={{ fontSize: 13, color: colorText }}>
                <ApartmentOutlined
                  style={{ marginRight: 6, color: colorPrimary }}
                />
                Workflow
              </Text>
              <Select
                value={selectedWorkflow}
                onChange={setSelectedWorkflow}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "Tất cả workflow" },
                  { value: "user-reg", label: "User Registration" },
                  { value: "payment", label: "Payment Processing" },
                  { value: "email", label: "Email Campaign" },
                ]}
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text strong style={{ fontSize: 13, color: colorText }}>
                <SearchOutlined
                  style={{ marginRight: 6, color: colorPrimary }}
                />
                Tìm kiếm
              </Text>
              <Input.Search
                placeholder="Tìm kiếm workflow, agent..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                loading={loading}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    Tìm
                  </Button>
                }
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text strong style={{ fontSize: 13, color: colorText }}>
                <FilterOutlined
                  style={{ marginRight: 6, color: colorPrimary }}
                />
                Hành động
              </Text>
              <Space style={{ width: "100%" }}>
                <Button
                  icon={<ReloadOutlined />}
                  loading={refreshing}
                  onClick={handleRefresh}
                  style={{ flex: 1 }}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<BarChartOutlined />}
                  onClick={() => console.log("export")}
                >
                  Xuất báo cáo
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Enhanced Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card
            hoverable
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorPrimary}15, ${colorPrimary}05)`,
              border: `1px solid ${colorPrimary}20`,
              height: 120,
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <Space>
                  <ApartmentOutlined style={{ color: colorPrimary }} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    Tổng Workflow
                  </span>
                </Space>
              }
              value={dashboardData.stats.totalWorkflows}
              valueStyle={{
                color: colorPrimary,
                fontWeight: 700,
                fontSize: 24,
              }}
              prefix={<ArrowUpOutlined />}
              suffix={
                <Tooltip title="Tăng 12% so với tháng trước">
                  <Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>
                    +12%
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card
            hoverable
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorSuccess}15, ${colorSuccess}05)`,
              border: `1px solid ${colorSuccess}20`,
              height: 120,
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: colorSuccess }} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    Tỷ lệ thành công
                  </span>
                </Space>
              }
              value={dashboardData.stats.successRate}
              precision={1}
              valueStyle={{
                color: colorSuccess,
                fontWeight: 700,
                fontSize: 24,
              }}
              prefix={<ArrowUpOutlined />}
              suffix={
                <Tooltip title="Cải thiện 2.1% so với tuần trước">
                  <Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>
                    %
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card
            hoverable
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorWarning}15, ${colorWarning}05)`,
              border: `1px solid ${colorWarning}20`,
              height: 120,
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <Space>
                  <ClockCircleOutlined style={{ color: colorWarning }} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    Thời gian TB
                  </span>
                </Space>
              }
              value={dashboardData.stats.avgResponseTime}
              precision={1}
              valueStyle={{
                color: colorWarning,
                fontWeight: 700,
                fontSize: 24,
              }}
              prefix={<ArrowDownOutlined />}
              suffix={
                <Tooltip title="Giảm 0.3s so với hôm qua">
                  <Tag color="orange" style={{ marginLeft: 8, fontSize: 11 }}>
                    s
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card
            hoverable
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorError}15, ${colorError}05)`,
              border: `1px solid ${colorError}20`,
              height: 120,
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: colorError }} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    Lỗi hôm nay
                  </span>
                </Space>
              }
              value={dashboardData.stats.todayErrors}
              valueStyle={{ color: colorError, fontWeight: 700, fontSize: 24 }}
              prefix={<ArrowDownOutlined />}
              suffix={
                <Tooltip title="Giảm 50% so với hôm qua">
                  <Tag color="red" style={{ marginLeft: 8, fontSize: 11 }}>
                    -50%
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: colorPrimary }} />
                <span>Xu hướng thực thi Workflow</span>
                <Badge dot color={colorSuccess} />
              </Space>
            }
            extra={
              <Space>
                <Button size="small" icon={<EyeOutlined />}>
                  Chi tiết
                </Button>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 420,
              boxShadow: boxShadowSecondary,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <Area {...executionAreaConfig} height={320} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined style={{ color: colorPrimary }} />
                <span>Phân bố loại Workflow</span>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 420,
              boxShadow: boxShadowSecondary,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <Pie {...typeDistributionConfig} height={320} />
          </Card>
        </Col>
      </Row>

      {/* Performance and Activities */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: colorSuccess }} />
                <span>Hiệu suất tổng thể</span>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 380,
              boxShadow: boxShadowSecondary,
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div style={{ textAlign: "center" }}>
              <Gauge {...performanceGaugeConfig} height={200} />
              <Divider />
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text>Total Executions:</Text>
                  <Text strong>
                    {dashboardData.stats.totalExecutions.toLocaleString()}
                  </Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text>Active Agents:</Text>
                  <Text strong style={{ color: colorSuccess }}>
                    {dashboardData.stats.onlineAgents}/
                    {dashboardData.stats.totalAgents}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (dashboardData.stats.onlineAgents /
                      dashboardData.stats.totalAgents) *
                      100
                  )}
                  strokeColor={colorSuccess}
                  size="small"
                />
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: colorPrimary }} />
                <span>Hoạt động gần đây</span>
                <Badge
                  count={
                    dashboardData.recentActivities.filter(
                      (a) => a.type !== "info"
                    ).length
                  }
                />
              </Space>
            }
            extra={
              <Button size="small" type="link" icon={<EyeOutlined />}>
                Xem tất cả
              </Button>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 380,
              boxShadow: boxShadowSecondary,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <List
              size="small"
              dataSource={dashboardData.recentActivities}
              renderItem={(item) => (
                <List.Item
                  style={{
                    border: "none",
                    padding: "12px 0",
                    borderBottom: `1px solid ${colorBgContainer}`,
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={36}
                        icon={getActivityIcon(item.type)}
                        style={{
                          backgroundColor: "transparent",
                          border: `2px solid ${
                            item.type === "success"
                              ? colorSuccess
                              : item.type === "warning"
                              ? colorWarning
                              : item.type === "error"
                              ? colorError
                              : colorInfo
                          }20`,
                        }}
                      />
                    }
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text strong style={{ fontSize: 13 }}>
                          {item.title}
                        </Text>
                        <Tag color="blue" style={{ fontSize: 11 }}>
                          {item.workflow}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text
                          style={{ fontSize: 12, color: colorTextSecondary }}
                        >
                          {item.description}
                        </Text>
                        <br />
                        <Space style={{ marginTop: 4 }}>
                          <Text
                            style={{ fontSize: 11, color: colorTextSecondary }}
                          >
                            {item.time}
                          </Text>
                          <Divider type="vertical" />
                          <Text
                            style={{ fontSize: 11, color: colorTextSecondary }}
                          >
                            by {item.user}
                          </Text>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Workflows */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: colorPrimary }} />
                <span>Top Workflow thực thi</span>
                <StarFilled style={{ color: "#faad14" }} />
              </Space>
            }
            extra={
              <Space>
                <Button size="small" icon={<BarChartOutlined />}>
                  Phân tích
                </Button>
                <Button size="small" type="primary" icon={<EyeOutlined />}>
                  Xem tất cả
                </Button>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              boxShadow: boxShadowSecondary,
            }}
          >
            <Row gutter={[16, 16]}>
              {dashboardData.topWorkflows.map((workflow, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={index}>
                  <Card
                    size="small"
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: borderRadiusLG,
                      background:
                        index === 0
                          ? `linear-gradient(135deg, ${colorPrimary}12, ${colorPrimary}06)`
                          : "transparent",
                      border:
                        index === 0 ? `1px solid ${colorPrimary}30` : undefined,
                      position: "relative",
                      overflow: "hidden",
                    }}
                    bodyStyle={{ padding: "16px 12px" }}
                  >
                    {index === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#faad14",
                        }}
                      >
                        <TrophyOutlined />
                      </div>
                    )}

                    <div style={{ marginBottom: 8 }}>
                      <Tooltip title={workflow.name}>
                        <Text
                          strong
                          style={{
                            fontSize: 13,
                            color: index === 0 ? colorPrimary : colorText,
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {workflow.name}
                        </Text>
                      </Tooltip>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: colorPrimary,
                        }}
                      >
                        {workflow.executions.toLocaleString()}
                      </Text>
                      <br />
                      <Text style={{ fontSize: 11, color: colorTextSecondary }}>
                        lần thực thi
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        {getTrendIcon(workflow.trend)}
                      </div>
                    </div>

                    <Progress
                      percent={workflow.success_rate}
                      size="small"
                      strokeColor={
                        workflow.success_rate >= 99
                          ? colorSuccess
                          : workflow.success_rate >= 95
                          ? colorWarning
                          : colorError
                      }
                      format={(percent) => `${percent}%`}
                      strokeWidth={6}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
