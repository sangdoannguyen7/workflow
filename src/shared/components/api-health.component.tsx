import { useEffect, useState } from "react";
import { Card, Badge, Typography, Button, Collapse, Space } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import axiosCustom, { IDataRequest } from "../../apis/axiosCustom";
import { constants } from "../../common/common.constants";
import ApiFallbackService from "../../apis/fallback.service";

const { Text } = Typography;

const ApiHealthCheck = () => {
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "mock"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const checkApiHealth = async () => {
    setStatus("checking");
    try {
      // Try multiple endpoints to check API health
      const healthEndpoints = [
        "/v1/health",
        "/v1/status",
        "/v1/ping",
        "/v1/users",
      ];

      let connected = false;
      for (const endpoint of healthEndpoints) {
        try {
          const request: IDataRequest = {
            method: "GET",
            uri: endpoint,
            params: null,
            data: null,
          };

          await axiosCustom(request);
          connected = true;
          break;
        } catch (error) {
          // Try next endpoint
          console.log(`Failed to connect to ${endpoint}:`, error);
        }
      }

      setStatus(connected ? "online" : "offline");
    } catch (error) {
      setStatus("offline");
      console.log("API Health check failed:", error);
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "green";
      case "offline":
        return "red";
      case "checking":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "API Online";
      case "offline":
        return "API Offline";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  const debugItems = [
    {
      key: "1",
      label: "API Configuration",
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>
            Backend Host:{" "}
            <Text code>{constants.BACKEND_HOST || "Not configured"}</Text>
          </Text>
          <Text>
            Proxy Target: <Text code>http://localhost:8080</Text>
          </Text>
          <Text>
            Expected API: <Text code>http://localhost:8080/v1/health</Text>
          </Text>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Make sure your API server is running on port 8080 and responding
              to /v1/* endpoints. You can test manually with:{" "}
              <Text code>curl http://localhost:8080/v1/health</Text>
            </Text>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        background: status === "offline" ? "#fff2f0" : "#f6ffed",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge status={getStatusColor()} />
          <Text strong>{getStatusText()}</Text>
          {lastCheck && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              (Last check: {lastCheck.toLocaleTimeString()})
            </Text>
          )}
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={checkApiHealth}
            loading={status === "checking"}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {status === "offline" && (
        <Collapse
          items={debugItems}
          ghost
          size="small"
          style={{ marginTop: 12 }}
          expandIcon={({ isActive }) => (
            <InfoCircleOutlined rotate={isActive ? 90 : 0} />
          )}
        />
      )}
    </Card>
  );
};

export default ApiHealthCheck;
