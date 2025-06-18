import { Image, Layout, Menu, theme, Typography, Divider } from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IState } from "../interface/action.interface";
import menuData from "../common/common.menudata.tsx";
import React from "react";

import logo from "../images/logo.png";

const { Text } = Typography;

const SiderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapseStore = useSelector((state: IState) => state.getCollapsed);
  const themeStore = useSelector((state: IState) => state.getTheme);

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      boxShadowSecondary,
      colorPrimary,
      colorText,
      colorTextSecondary,
    },
  } = theme.useToken();

  const isDark = themeStore.type === "dark";
  const isCollapsed = collapseStore?.type === "large";

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
      width={260}
      collapsedWidth={64}
      theme="light"
    >
      {/* Logo Section */}
      <div
        style={{
          padding: isCollapsed ? "16px 8px" : "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          borderBottom: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
          minHeight: 80,
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
          onClick={() => navigate("/")}
        >
          <Image
            src={logo}
            preview={false}
            width={isCollapsed ? 32 : 40}
            height={isCollapsed ? 32 : 40}
            style={{
              borderRadius: 8,
              transition: "all 0.2s",
            }}
          />
          {!isCollapsed && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                strong
                style={{
                  fontSize: 16,
                  color: colorPrimary,
                  lineHeight: 1.2,
                }}
              >
                Travel Admin
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colorTextSecondary,
                  lineHeight: 1.2,
                }}
              >
                Management System
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        style={{
          padding: "8px 0",
          height: "calc(100% - 80px)",
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
                  fontWeight: getSelectedKeys().includes(item.key) ? 500 : 400,
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
              margin: "4px 8px",
              borderRadius: 8,
              height: 44,
              lineHeight: "44px",
              display: "flex",
              alignItems: "center",
            },
          }))}
        />

        {!isCollapsed && (
          <>
            <Divider
              style={{
                margin: "16px 20px",
                borderColor: isDark ? "#303030" : "#f0f0f0",
              }}
            />

            {/* Footer Info */}
            <div
              style={{
                padding: "0 20px 16px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: colorTextSecondary,
                  lineHeight: 1.4,
                }}
              >
                Travel Admin v2.0
                <br />© 2024 Nguyễn Thanh Sang
              </Text>
            </div>
          </>
        )}
      </div>
    </Layout.Sider>
  );
};

export default SiderLayout;
