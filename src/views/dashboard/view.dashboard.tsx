import React, { useState, useEffect } from "react";
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
  Timeline,
  List,
} from "antd";
import {
  SearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  RobotOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  TeamOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Column, Pie, Line, Area } from "@ant-design/plots";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorPrimary,
      colorSuccess,
      colorWarning,
      colorError,
      colorTextSecondary,
    },
  } = theme.useToken();

  // Mock data for charts
  const workflowExecutionData = [
    { date: "2024-01-01", executions: 120, success: 110, failed: 10 },
    { date: "2024-01-02", executions: 150, success: 140, failed: 10 },
    { date: "2024-01-03", executions: 180, success: 165, failed: 15 },
    { date: "2024-01-04", executions: 200, success: 185, failed: 15 },
    { date: "2024-01-05", executions: 160, success: 145, failed: 15 },
    { date: "2024-01-06", executions: 220, success: 200, failed: 20 },
    { date: "2024-01-07", executions: 190, success: 175, failed: 15 },
  ];

  const workflowTypeData = [
    { type: "Webhook", count: 45, percentage: 35 },
    { type: "Schedule", count: 30, percentage: 25 },
    { type: "REST API", count: 25, percentage: 20 },
    { type: "Process", count: 20, percentage: 15 },
    { type: "Other", count: 8, percentage: 5 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "success",
      title: 'Workflow "Data Sync" hoàn thành',
      description: "Đã xử lý 1,234 records thành công",
      time: "2 phút trước",
      icon: <CheckCircleOutlined style={{ color: colorSuccess }} />,
    },
    {
      id: 2,
      type: "warning",
      title: 'Agent "Email Service" chậm phản hồi',
      description: "Thời gian phản hồi trung bình: 5.2s",
      time: "15 phút trước",
      icon: <ExclamationCircleOutlined style={{ color: colorWarning }} />,
    },
    {
      id: 3,
      type: "info",
      title: "Template mới được tạo",
      description: 'Template "Payment Notification" đã được thêm',
      time: "1 giờ trước",
      icon: <SyncOutlined style={{ color: colorPrimary }} />,
    },
    {
      id: 4,
      type: "success",
      title: 'Node "Validation" đã cập nhật',
      description: "Thêm rule validation mới cho email format",
      time: "2 giờ trước",
      icon: <CheckCircleOutlined style={{ color: colorSuccess }} />,
    },
  ];

  const topWorkflows = [
    { name: "User Registration Flow", executions: 1250, success_rate: 98.5 },
    { name: "Payment Processing", executions: 890, success_rate: 99.2 },
    { name: "Email Campaign", executions: 756, success_rate: 97.8 },
    { name: "Data Backup", executions: 124, success_rate: 100 },
    { name: "Report Generation", executions: 89, success_rate: 96.5 },
  ];

  // Chart configurations
  const executionAreaConfig = {
    data: workflowExecutionData,
    xField: "date",
    yField: "executions",
    smooth: true,
    color: colorPrimary,
    areaStyle: {
      fill: `${colorPrimary}20`,
    },
    line: {
      color: colorPrimary,
      size: 2,
    },
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: colorPrimary,
        stroke: "#fff",
        lineWidth: 2,
      },
    },
  };

  const typeDistributionConfig = {
    data: workflowTypeData,
    angleField: "count",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "spider",
      labelHeight: 40,
      formatter: (data: any) => `${data.type}: ${data.percentage}%`,
    },
    statistic: {
      title: {
        formatter: () => "Tổng",
      },
      content: {
        formatter: () => "128",
      },
    },
  };

  const performanceLineConfig = {
    data: workflowExecutionData
      .map((d) => [
        { date: d.date, type: "Success", count: d.success },
        { date: d.date, type: "Failed", count: d.failed },
      ])
      .flat(),
    xField: "date",
    yField: "count",
    seriesField: "type",
    color: [colorSuccess, colorError],
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  };

  return (
    <div
      style={{
        padding: 16,
        background: "transparent",
        minHeight: "100%",
      }}
    >
      {/* Header Controls */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: borderRadiusLG,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: "16px 24px" }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Text strong>Thời gian:</Text>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates || [])}
                format="DD/MM/YYYY"
                allowClear={false}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space style={{ width: "100%" }}>
              <Text strong>Workflow:</Text>
              <Select
                placeholder="Chọn workflow"
                style={{ width: "100%", minWidth: 200 }}
                allowClear
                options={[
                  { value: "all", label: "Tất cả workflow" },
                  { value: "user-reg", label: "User Registration" },
                  { value: "payment", label: "Payment Processing" },
                  { value: "email", label: "Email Campaign" },
                ]}
              />
            </Space>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={loading}
                onClick={() => setLoading(true)}
              >
                Cập nhật dữ liệu
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorPrimary}15, ${colorPrimary}05)`,
            }}
          >
            <Statistic
              title={
                <Space>
                  <ApartmentOutlined style={{ color: colorPrimary }} />
                  <span>Tổng Workflow</span>
                </Space>
              }
              value={128}
              valueStyle={{ color: colorPrimary, fontWeight: 600 }}
              prefix={<ArrowUpOutlined />}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  +12%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorSuccess}15, ${colorSuccess}05)`,
            }}
          >
            <Statistic
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: colorSuccess }} />
                  <span>Thành công</span>
                </Space>
              }
              value={98.5}
              precision={1}
              valueStyle={{ color: colorSuccess, fontWeight: 600 }}
              prefix={<ArrowUpOutlined />}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  %
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorWarning}15, ${colorWarning}05)`,
            }}
          >
            <Statistic
              title={
                <Space>
                  <ClockCircleOutlined style={{ color: colorWarning }} />
                  <span>Thời gian TB</span>
                </Space>
              }
              value={2.8}
              precision={1}
              valueStyle={{ color: colorWarning, fontWeight: 600 }}
              prefix={<ArrowDownOutlined />}
              suffix={
                <Tag color="orange" style={{ marginLeft: 8 }}>
                  s
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              borderRadius: borderRadiusLG,
              background: `linear-gradient(135deg, ${colorError}15, ${colorError}05)`,
            }}
          >
            <Statistic
              title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: colorError }} />
                  <span>Lỗi hôm nay</span>
                </Space>
              }
              value={7}
              valueStyle={{ color: colorError, fontWeight: 600 }}
              prefix={<ArrowDownOutlined />}
              suffix={
                <Tag color="red" style={{ marginLeft: 8 }}>
                  -50%
                </Tag>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: colorPrimary }} />
                <span>Thực thi Workflow theo thời gian</span>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 400,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <Area {...executionAreaConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <RobotOutlined style={{ color: colorPrimary }} />
                <span>Phân bố loại Template</span>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 400,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <Pie {...typeDistributionConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Performance and Activities */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: colorSuccess }} />
                <span>Hiệu suất Workflow</span>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 350,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <Line {...performanceLineConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: colorPrimary }} />
                <span>Hoạt động gần đây</span>
              </Space>
            }
            style={{
              borderRadius: borderRadiusLG,
              height: 350,
            }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            <List
              size="small"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ border: "none", padding: "8px 0" }}>
                  <List.Item.Meta
                    avatar={<Avatar size="small" icon={item.icon} />}
                    title={
                      <Text style={{ fontSize: 13, fontWeight: 500 }}>
                        {item.title}
                      </Text>
                    }
                    description={
                      <div>
                        <Text
                          style={{ fontSize: 12, color: colorTextSecondary }}
                        >
                          {item.description}
                        </Text>
                        <br />
                        <Text
                          style={{ fontSize: 11, color: colorTextSecondary }}
                        >
                          {item.time}
                        </Text>
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
              </Space>
            }
            extra={
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => console.log("view all")}
              >
                Xem tất cả
              </Button>
            }
            style={{
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={[16, 16]}>
              {topWorkflows.map((workflow, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={index}>
                  <Card
                    size="small"
                    style={{
                      textAlign: "center",
                      borderRadius: 8,
                      background:
                        index === 0 ? `${colorPrimary}08` : "transparent",
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          color: index === 0 ? colorPrimary : undefined,
                        }}
                      >
                        {workflow.name}
                      </Text>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 20, fontWeight: 600 }}>
                        {workflow.executions.toLocaleString()}
                      </Text>
                      <br />
                      <Text style={{ fontSize: 12, color: colorTextSecondary }}>
                        lần thực thi
                      </Text>
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
