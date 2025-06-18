import { useEffect, useState } from "react";
import { Card, Badge, Typography, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axiosCustom, { IDataRequest } from "../../apis/axiosCustom";

const { Text } = Typography;

const ApiHealthCheck = () => {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    setStatus("checking");
    try {
      const request: IDataRequest = {
        method: "GET",
        uri: "/v1/health",
        params: null,
        data: null,
      };

      await axiosCustom(request);
      setStatus("online");
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
        <Button
          icon={<ReloadOutlined />}
          size="small"
          onClick={checkApiHealth}
          loading={status === "checking"}
        >
          Refresh
        </Button>
      </div>
    </Card>
  );
};

export default ApiHealthCheck;
