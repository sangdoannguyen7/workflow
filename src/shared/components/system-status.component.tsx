import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import ApiFallbackService from "../../apis/fallback.service";

const { Text, Title } = Typography;

interface SystemMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalTemplates: number;
  totalAgents: number;
  mockDataEnabled: boolean;
  apiResponseTime: number;
  systemHealth: "excellent" | "good" | "warning" | "error";
}

const SystemStatusComponent: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalTemplates: 0,
    totalAgents: 0,
    mockDataEnabled: false,
    apiResponseTime: 0,
    systemHealth: "good",
  });

  useEffect(() => {
    loadSystemMetrics();
  }, []);

  const loadSystemMetrics = async () => {
    const startTime = Date.now();

    try {
      // Simulate loading data to get metrics
      setMetrics({
        totalWorkflows: 13, // Updated count with test workflows
        activeWorkflows: 10,
        totalTemplates: 6,
        totalAgents: 5,
        mockDataEnabled: ApiFallbackService.shouldUseMockData(),
        apiResponseTime: Date.now() - startTime,
        systemHealth: ApiFallbackService.shouldUseMockData()
          ? "good"
          : "excellent",
      });
    } catch (error) {
      setMetrics((prev) => ({
        ...prev,
        systemHealth: "error",
        apiResponseTime: Date.now() - startTime,
      }));
    }
  };

  const getHealthColor = () => {
    switch (metrics.systemHealth) {
      case "excellent":
        return "#52c41a";
      case "good":
        return "#1890ff";
      case "warning":
        return "#faad14";
      case "error":
        return "#ff4d4f";
      default:
        return "#d9d9d9";
    }
  };

  const getHealthIcon = () => {
    switch (metrics.systemHealth) {
      case "excellent":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "good":
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
      case "warning":
        return <WarningOutlined style={{ color: "#faad14" }} />;
      case "error":
        return <WarningOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  return (
    <Card
      title={
        <Space>
          <RocketOutlined />
          <Text strong>System Status</Text>
          {getHealthIcon()}
          <Tag color={getHealthColor()}>
            {metrics.systemHealth.toUpperCase()}
          </Tag>
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Workflows"
            value={metrics.totalWorkflows}
            prefix={<ToolOutlined />}
            valueStyle={{ color: "#1890ff", fontSize: "18px" }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Active"
            value={metrics.activeWorkflows}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a", fontSize: "18px" }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Templates"
            value={metrics.totalTemplates}
            prefix={<DatabaseOutlined />}
            valueStyle={{ color: "#fa8c16", fontSize: "18px" }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Agents"
            value={metrics.totalAgents}
            prefix={<ApiOutlined />}
            valueStyle={{ color: "#722ed1", fontSize: "18px" }}
          />
        </Col>
      </Row>

      <Divider style={{ margin: "16px 0" }} />

      <Row gutter={[16, 8]}>
        <Col span={12}>
          <div>
            <Text strong style={{ fontSize: "12px" }}>
              Data Source
            </Text>
            <div style={{ marginTop: 4 }}>
              <Tag color={metrics.mockDataEnabled ? "orange" : "green"}>
                {metrics.mockDataEnabled ? "Mock Data" : "Live API"}
              </Tag>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div>
            <Text strong style={{ fontSize: "12px" }}>
              Response Time
            </Text>
            <div style={{ marginTop: 4 }}>
              <Text style={{ fontSize: "14px", color: "#52c41a" }}>
                {metrics.apiResponseTime}ms
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: 12 }}>
        <Text strong style={{ fontSize: "12px" }}>
          System Health
        </Text>
        <Progress
          percent={
            metrics.systemHealth === "excellent"
              ? 100
              : metrics.systemHealth === "good"
              ? 80
              : metrics.systemHealth === "warning"
              ? 60
              : 30
          }
          strokeColor={getHealthColor()}
          showInfo={false}
          size="small"
          style={{ marginTop: 4 }}
        />
      </div>

      {metrics.mockDataEnabled && (
        <div
          style={{
            marginTop: 12,
            padding: 8,
            background: "#fff7e6",
            borderRadius: 4,
            fontSize: 11,
          }}
        >
          <DatabaseOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
          <Text style={{ color: "#d46b08" }}>
            Running with mock data. All features functional for testing and
            demonstration.
          </Text>
        </div>
      )}
    </Card>
  );
};

export default SystemStatusComponent;
