import { useState } from "react";
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
  Drawer,
  Typography,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  List,
  Tag,
} from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  EditOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../interface/action.interface";
import { useDarkMode, useLightMode } from "../redux/actions/theme.action";
import {
  useCollapsedLarge,
  useCollapsedSmall,
} from "../redux/actions/collapsed.action";
import { MockAPI } from "../mock/enhanced.mock";
import { NotificationComponent } from "../shared/components/notification/notification";

const { Text } = Typography;

const HeaderLayout = () => {
  const dispatch = useDispatch();
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [profileForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

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
      colorBorder,
      colorSuccess,
      colorWarning,
      colorError,
      colorInfo,
    },
  } = theme.useToken();

  const isDark = themeStore.type === "dark";

  // Load data functions
  const loadNotifications = async () => {
    try {
      const result = await MockAPI.getNotifications();
      setNotifications(result.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const result = await MockAPI.getUserProfile();
      setUserProfile(result.data);
      profileForm.setFieldsValue(result.data);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const loadSystemSettings = async () => {
    try {
      const result = await MockAPI.getSystemSettings();
      setSystemSettings(result.data);
      settingsForm.setFieldsValue(result.data);
    } catch (error) {
      console.error("Failed to load system settings:", error);
    }
  };

  // Handle drawer open
  const handleProfileOpen = () => {
    setProfileDrawerVisible(true);
    loadUserProfile();
  };

  const handleSettingsOpen = () => {
    setSettingsDrawerVisible(true);
    loadSystemSettings();
  };

  const handleNotificationOpen = () => {
    setNotificationDrawerVisible(true);
    loadNotifications();
  };

  // Handle form submissions
  const handleProfileUpdate = async (values: any) => {
    try {
      await MockAPI.updateUserProfile(values);
      setUserProfile({ ...userProfile, ...values });
      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Cập nhật thông tin cá nhân thành công",
      });
      setProfileDrawerVisible(false);
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể cập nhật thông tin cá nhân",
      });
    }
  };

  const handleSettingsUpdate = async (values: any) => {
    try {
      await MockAPI.updateSystemSettings(values);
      setSystemSettings({ ...systemSettings, ...values });
      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Cập nhật cài đặt hệ thống thành công",
      });
      setSettingsDrawerVisible(false);
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể cập nhật cài đặt hệ thống",
      });
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      await MockAPI.markNotificationAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckOutlined style={{ color: colorSuccess }} />;
      case "warning":
        return <ExclamationCircleOutlined style={{ color: colorWarning }} />;
      case "error":
        return <CloseCircleOutlined style={{ color: colorError }} />;
      case "info":
      default:
        return <InfoCircleOutlined style={{ color: colorInfo }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return colorSuccess;
      case "warning":
        return colorWarning;
      case "error":
        return colorError;
      case "info":
      default:
        return colorInfo;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const userMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <span onClick={handleProfileOpen}>Thông tin cá nhân</span>,
    },
    {
      key: "2",
      icon: <SettingOutlined />,
      label: <span onClick={handleSettingsOpen}>Cài đặt hệ thống</span>,
    },
    {
      type: "divider" as const,
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

  // Enhanced component frame styles
  const frameStyle = {
    border: `1px solid ${isDark ? "#444444" : "#E0E0E0"}`,
    borderRadius: 8,
    padding: "6px 8px",
    background: isDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(25, 118, 210, 0.04)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    boxShadow: `0 2px 8px ${
      isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(25, 118, 210, 0.1)"
    }`,
  };

  const notificationFrameStyle = {
    ...frameStyle,
    border: `1px solid ${isDark ? "#444444" : "#E0E0E0"}`,
    padding: "4px 6px",
    background: isDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(25, 118, 210, 0.04)",
  };

  const avatarFrameStyle = {
    ...frameStyle,
    padding: "2px",
    border: `2px solid ${isDark ? "#444444" : "#E0E0E0"}`,
    background: isDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(25, 118, 210, 0.04)",
  };

  return (
    <>
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
        {/* Left Section */}
        <Space size="middle">
          <div style={frameStyle}>
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
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colorText,
                border: "none",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: colorPrimary,
              marginLeft: 12,
            }}
          >
            WorkflowUI Management
          </div>
        </Space>

        {/* Right Section */}
        <Space size="middle">
          {/* Enhanced Theme Toggle */}
          <div style={frameStyle}>
            <Tooltip
              title={
                isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "2px 4px",
                  background: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(25, 118, 210, 0.08)",
                  borderRadius: 6,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    padding: "2px",
                    borderRadius: 4,
                    background: !isDark ? `${colorPrimary}15` : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <SunOutlined
                    style={{
                      color: !isDark ? colorPrimary : colorTextSecondary,
                      fontSize: 12,
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
                <Switch
                  checked={isDark}
                  onChange={() => dispatch(nextTheme())}
                  size="small"
                  style={{
                    backgroundColor: isDark ? colorPrimary : "#f0f0f0",
                    border: `1px solid ${isDark ? colorPrimary : "#d9d9d9"}`,
                  }}
                />
                <div
                  style={{
                    padding: "2px",
                    borderRadius: 4,
                    background: isDark ? `${colorPrimary}15` : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <MoonOutlined
                    style={{
                      color: isDark ? colorPrimary : colorTextSecondary,
                      fontSize: 12,
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </Tooltip>
          </div>

          {/* Enhanced Notifications */}
          <div style={notificationFrameStyle}>
            <Tooltip title="Thông báo">
              <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  onClick={handleNotificationOpen}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colorText,
                    border: "none",
                    borderRadius: 6,
                    background:
                      unreadCount > 0 ? `${colorPrimary}10` : "transparent",
                    transition: "all 0.2s ease",
                  }}
                />
              </Badge>
            </Tooltip>
          </div>

          {/* Enhanced User Profile */}
          <div style={avatarFrameStyle}>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <Space style={{ cursor: "pointer", padding: "4px 6px" }}>
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={
                      <img
                        src={"https://api.dicebear.com/7.x/miniavs/svg?seed=3"}
                        alt="avatar"
                      />
                    }
                    size={28}
                    style={{
                      border: `2px solid ${colorPrimary}`,
                      boxShadow: `0 2px 8px ${colorPrimary}40`,
                      transition: "all 0.2s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: -1,
                      right: -1,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#52c41a",
                      border: "1px solid white",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    lineHeight: 1.2,
                    marginLeft: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: colorText,
                    }}
                  >
                    Admin User
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: colorTextSecondary,
                      opacity: 0.8,
                    }}
                  >
                    Quản trị viên
                  </span>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Space>
      </Layout.Header>

      {/* Profile Drawer */}
      <Drawer
        title={
          <Space>
            <UserOutlined style={{ color: colorPrimary }} />
            <span>Thông tin cá nhân</span>
          </Space>
        }
        open={profileDrawerVisible}
        onClose={() => setProfileDrawerVisible(false)}
        width={480}
      >
        {userProfile && (
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <Card
              title="Thông tin cơ bản"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="firstName" label="Tên">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" label="Họ">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại">
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="role" label="Vai trò">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="department" label="Bộ phận">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              title="Tùy chọn cá nhân"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Form.Item name={["preferences", "theme"]} label="Giao diện">
                <Select>
                  <Select.Option value="light">Sáng</Select.Option>
                  <Select.Option value="dark">Tối</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name={["preferences", "language"]} label="Ngôn ngữ">
                <Select>
                  <Select.Option value="vi">Tiếng Việt</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Form.Item>
            </Card>

            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setProfileDrawerVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                Cập nhật
              </Button>
            </Space>
          </Form>
        )}
      </Drawer>

      {/* Settings Drawer */}
      <Drawer
        title={
          <Space>
            <SettingOutlined style={{ color: colorPrimary }} />
            <span>Cài đặt hệ thống</span>
          </Space>
        }
        open={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
        width={560}
      >
        {systemSettings && (
          <Form
            form={settingsForm}
            layout="vertical"
            onFinish={handleSettingsUpdate}
          >
            <Card
              title="Cài đặt chung"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Form.Item name={["general", "siteName"]} label="Tên website">
                <Input />
              </Form.Item>
              <Form.Item name={["general", "siteDescription"]} label="Mô tả">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name={["general", "timezone"]} label="Múi giờ">
                    <Select>
                      <Select.Option value="Asia/Ho_Chi_Minh">
                        Việt Nam
                      </Select.Option>
                      <Select.Option value="UTC">UTC</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["general", "dateFormat"]}
                    label="Định dạng ngày"
                  >
                    <Select>
                      <Select.Option value="DD/MM/YYYY">
                        DD/MM/YYYY
                      </Select.Option>
                      <Select.Option value="MM/DD/YYYY">
                        MM/DD/YYYY
                      </Select.Option>
                      <Select.Option value="YYYY-MM-DD">
                        YYYY-MM-DD
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Cài đặt API" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name={["api", "timeout"]} label="Timeout (ms)">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["api", "retryAttempts"]}
                    label="Số lần thử lại"
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              title="Cài đặt bảo mật"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={["security", "sessionTimeout"]}
                    label="Timeout phiên (ms)"
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["security", "passwordMinLength"]}
                    label="Độ dài mật khẩu tối thiểu"
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setSettingsDrawerVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SettingOutlined />}
              >
                Lưu cài đặt
              </Button>
            </Space>
          </Form>
        )}
      </Drawer>

      {/* Notifications Drawer */}
      <Drawer
        title={
          <Space>
            <BellOutlined style={{ color: colorPrimary }} />
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <Badge
                count={unreadCount}
                style={{ backgroundColor: colorPrimary }}
              />
            )}
          </Space>
        }
        open={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
        width={400}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              size="small"
              onClick={() => {
                notifications.forEach((n) => {
                  if (!n.read) markNotificationAsRead(n.id);
                });
              }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          </Space>
        </div>

        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                padding: "12px",
                backgroundColor: notification.read
                  ? "transparent"
                  : `${colorPrimary}08`,
                border: `1px solid ${
                  notification.read ? colorBorder : colorPrimary
                }30`,
                borderRadius: 8,
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <List.Item.Meta
                avatar={getNotificationIcon(notification.type)}
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text strong style={{ fontSize: 13 }}>
                      {notification.title}
                    </Text>
                    <Tag
                      color={getNotificationColor(notification.type)}
                      style={{ marginLeft: 8, fontSize: 11 }}
                    >
                      {notification.category}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text style={{ fontSize: 12 }}>{notification.message}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {new Date(notification.timestamp).toLocaleString("vi-VN")}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        {notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <BellOutlined
              style={{
                fontSize: 48,
                color: colorTextSecondary,
                marginBottom: 16,
              }}
            />
            <br />
            <Text type="secondary">Không có thông báo nào</Text>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default HeaderLayout;
