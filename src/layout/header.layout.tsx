import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Switch,
  theme,
  Space,
  Badge,
  Tooltip,
} from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import MoonIcon from "../shared/icons/moon.icon";
import SunIcon from "../shared/icons/sun.icon";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../interface/action.interface";
import { useDarkMode, useLightMode } from "../redux/actions/theme.action";
import {
  useCollapsedLarge,
  useCollapsedSmall,
} from "../redux/actions/collapsed.action";

const HeaderLayout = () => {
  const dispatch = useDispatch();

  const themeStore = useSelector((state: IState) => state.getTheme);
  const collapseStore = useSelector((state: IState) => state.getCollapsed);

  const nextTheme = themeStore.type === "dark" ? useLightMode : useDarkMode;
  const nextCollapse =
    collapseStore.type === "large" ? useCollapsedSmall : useCollapsedLarge;

  const {
    token: {
      colorBgContainer,
      colorPrimary,
      borderRadiusLG,
      boxShadowSecondary,
      colorText,
      colorTextSecondary,
    },
  } = theme.useToken();

  const isDark = themeStore.type === "dark";

  const userMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: (
        <span onClick={() => console.log("profile")}>Thông tin cá nhân</span>
      ),
    },
    {
      key: "2",
      icon: <SettingOutlined />,
      label: <span onClick={() => console.log("settings")}>Cài đặt</span>,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: (
        <span
          onClick={() => console.log("logout")}
          style={{ color: "#ff4d4f" }}
        >
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <Layout.Header
      style={{
        margin: "4px 4px 0 4px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,
        border: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
        padding: "0 16px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Section - Menu Toggle */}
      <Space size="middle">
        <Button
          type="text"
          icon={
            nextCollapse().type === "small" ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )
          }
          onClick={() => dispatch(nextCollapse())}
          style={{
            fontSize: "16px",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            color: colorText,
          }}
        />

        {/* Breadcrumb or Page Title can go here */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: colorText,
            marginLeft: 8,
          }}
        >
          Travel Admin
        </div>
      </Space>

      {/* Right Section - User Controls */}
      <Space size="middle">
        {/* Language Selector */}
        <Tooltip title="Ngôn ngữ">
          <Button
            type="text"
            icon={<GlobalOutlined />}
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              color: colorTextSecondary,
            }}
            onClick={() => console.log("language")}
          />
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}>
          <Switch
            checked={isDark}
            checkedChildren={<MoonIcon />}
            unCheckedChildren={<SunIcon />}
            onChange={() => dispatch(nextTheme())}
            style={{
              backgroundColor: isDark ? colorPrimary : "#f0f0f0",
            }}
          />
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Thông báo">
          <Badge count={5} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                color: colorTextSecondary,
              }}
              onClick={() => console.log("notifications")}
            />
          </Badge>
        </Tooltip>

        {/* User Avatar and Dropdown */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <Space
            style={{ cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}
          >
            <Avatar
              src={
                <img
                  src={"https://api.dicebear.com/7.x/miniavs/svg?seed=3"}
                  alt="avatar"
                />
              }
              size={36}
              style={{
                border: `2px solid ${colorPrimary}20`,
                boxShadow: `0 2px 8px ${colorPrimary}30`,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: colorText,
                }}
              >
                Admin User
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: colorTextSecondary,
                }}
              >
                Quản trị viên
              </span>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Layout.Header>
  );
};

export default HeaderLayout;
