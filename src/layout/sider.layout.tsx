import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Typography, Badge, Space, Tooltip } from "antd";
import {
  WifiOutlined,
  DisconnectOutlined,
  ApartmentOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IState } from "../interface/action.interface";
import menuData from "../common/common.menudata.tsx";

// Import workflow logo (you can replace this with your actual logo)
import logo from "../images/logo.png";

const { Text } = Typography;

const SiderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapseStore = useSelector((state: IState) => state.getCollapsed);
  const themeStore = useSelector((state: IState) => state.getTheme);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [systemStatus, setSystemStatus] = useState({
    workflows: 12,
    activeAgents: 3,
    totalAgents: 4,
    lastSync: new Date(),
  });

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      boxShadowSecondary,
      colorPrimary,
      colorText,
      colorTextSecondary,
      colorSuccess,
      colorError,
      colorWarning,
    },
  } = theme.useToken();

  const isDark = themeStore.type === "dark";
  const isCollapsed = collapseStore?.type === "large";

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        lastSync: new Date(),
        activeAgents: Math.floor(Math.random() * 4) + 1,
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (key: string) => {
    const menuItem = menuData.find((item) => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const menuItem = menuData.find((item) => item.path === currentPath);
    return menuItem ? [menuItem.key] : [];
  };

  const getOnlineStatusColor = () => {
    if (!isOnline) return colorError;
    if (systemStatus.activeAgents === systemStatus.totalAgents)
      return colorSuccess;
    return colorWarning;
  };

  const getOnlineStatusText = () => {
    if (!isOnline) return "Offline";
    if (systemStatus.activeAgents === systemStatus.totalAgents)
      return "All Systems Online";
    return `${systemStatus.activeAgents}/${systemStatus.totalAgents} Agents Online`;
  };

  const style: React.CSSProperties = {
    margin: "4px 0 4px 4px",
    height: "calc(100vh - 8px)",
    position: "sticky",
    top: 4,
    zIndex: 1,
    backgroundColor: colorBgContainer,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
    border: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
    overflow: "hidden",
    transition: "all 0.2s",
  };

  return (
    <Layout.Sider
      style={style}
      trigger={null}
      collapsible
      collapsed={isCollapsed}
      width={280}
      collapsedWidth={64}
      theme="light"
    >
      {/* Logo and Brand Section */}
      <div
        style={{
          padding: isCollapsed ? "16px 8px" : "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          borderBottom: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
          minHeight: 80,
          transition: "all 0.2s",
          background: `linear-gradient(135deg, ${colorPrimary}10, ${colorPrimary}05)`,
        }}
      >
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
          onClick={() => navigate("/")}
        >
          {/* Workflow Icon instead of logo */}
          <div
            style={{
              width: isCollapsed ? 32 : 48,
              height: isCollapsed ? 32 : 48,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${colorPrimary}, ${colorPrimary}cc)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${colorPrimary}40`,
              transition: "all 0.2s",
            }}
          >
            <ApartmentOutlined
              style={{
                color: "white",
                fontSize: isCollapsed ? 18 : 24,
                fontWeight: "bold",
              }}
            />
          </div>

          {!isCollapsed && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                strong
                style={{
                  fontSize: 18,
                  color: colorPrimary,
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${colorPrimary}, ${colorPrimary}aa)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                WorkFlow Pro
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colorTextSecondary,
                  lineHeight: 1.2,
                  fontWeight: 500,
                }}
              >
                Advanced Management
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div
        style={{
          padding: isCollapsed ? "12px 8px" : "16px 24px",
          borderBottom: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
          background: isCollapsed
            ? "transparent"
            : `${getOnlineStatusColor()}08`,
        }}
      >
        {isCollapsed ? (
          <Tooltip title={getOnlineStatusText()} placement="right">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge
                dot
                color={getOnlineStatusColor()}
                style={{
                  transform: "scale(1.5)",
                  boxShadow: `0 0 8px ${getOnlineStatusColor()}`,
                }}
              >
                {isOnline ? (
                  <WifiOutlined style={{ color: colorTextSecondary }} />
                ) : (
                  <DisconnectOutlined style={{ color: colorError }} />
                )}
              </Badge>
            </div>
          </Tooltip>
        ) : (
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Space size={8}>
                <Badge dot color={getOnlineStatusColor()}>
                  {isOnline ? (
                    <WifiOutlined style={{ color: getOnlineStatusColor() }} />
                  ) : (
                    <DisconnectOutlined style={{ color: colorError }} />
                  )}
                </Badge>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: getOnlineStatusColor(),
                  }}
                >
                  {getOnlineStatusText()}
                </Text>
              </Space>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space size={12}>
                <Tooltip title="Active Workflows">
                  <Space size={4}>
                    <ThunderboltOutlined
                      style={{ fontSize: 12, color: colorSuccess }}
                    />
                    <Text style={{ fontSize: 11, color: colorTextSecondary }}>
                      {systemStatus.workflows}
                    </Text>
                  </Space>
                </Tooltip>
                <Tooltip title="Online Agents">
                  <Space size={4}>
                    <ApiOutlined
                      style={{ fontSize: 12, color: colorPrimary }}
                    />
                    <Text style={{ fontSize: 11, color: colorTextSecondary }}>
                      {systemStatus.activeAgents}/{systemStatus.totalAgents}
                    </Text>
                  </Space>
                </Tooltip>
              </Space>
              <Text style={{ fontSize: 10, color: colorTextSecondary }}>
                {systemStatus.lastSync.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </div>
          </Space>
        )}
      </div>

      {/* Navigation Menu */}
      <div
        style={{
          padding: "12px 0",
          height: "calc(100% - 180px)",
          overflow: "auto",
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          style={{
            border: "none",
            background: "transparent",
            fontSize: 14,
          }}
          items={menuData.map((item) => ({
            key: item.key,
            icon: React.cloneElement(item.icon.props.children, {
              style: {
                fontSize: 16,
                color: getSelectedKeys().includes(item.key)
                  ? colorPrimary
                  : colorTextSecondary,
              },
            }),
            label: (
              <span
                style={{
                  fontWeight: getSelectedKeys().includes(item.key) ? 600 : 400,
                  color: getSelectedKeys().includes(item.key)
                    ? colorText
                    : colorTextSecondary,
                }}
              >
                {item.label}
              </span>
            ),
            onClick: () => handleMenuClick(item.key),
            style: {
              margin: "6px 12px",
              borderRadius: 10,
              height: 48,
              lineHeight: "48px",
              display: "flex",
              alignItems: "center",
              background: getSelectedKeys().includes(item.key)
                ? `linear-gradient(135deg, ${colorPrimary}15, ${colorPrimary}08)`
                : "transparent",
              border: getSelectedKeys().includes(item.key)
                ? `1px solid ${colorPrimary}30`
                : "1px solid transparent",
              transition: "all 0.2s ease",
            },
          }))}
        />
      </div>

      {/* Footer Section */}
      {!isCollapsed && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 24px",
            borderTop: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
            background: colorBgContainer,
          }}
        >
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: colorTextSecondary,
                  fontWeight: 500,
                }}
              >
                WorkFlow Pro v2.1.0
              </Text>
              <Badge dot color={colorSuccess}>
                <SettingOutlined
                  style={{ fontSize: 12, color: colorTextSecondary }}
                />
              </Badge>
            </div>
            <Text
              style={{
                fontSize: 10,
                color: colorTextSecondary,
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              © 2024 Workflow Systems
              <br />
              Nguyễn Thanh Sang
            </Text>
          </Space>
        </div>
      )}
    </Layout.Sider>
  );
};

export default SiderLayout;
