import React from "react";
import {
  Layout,
  theme,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Button,
} from "antd";
import {
  HeartFilled,
  GithubOutlined,
  TwitterOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ApiOutlined,
  ApartmentOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text, Link } = Typography;

const FooterComponent = () => {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      boxShadowSecondary,
      colorTextSecondary,
      colorPrimary,
      colorText,
      colorBorder,
    },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <MailOutlined />,
      label: "Email",
      value: "contact@workflow.pro",
      link: "mailto:contact@workflow.pro",
    },
    {
      icon: <PhoneOutlined />,
      label: "Hotline",
      value: "+84 123 456 789",
      link: "tel:+84123456789",
    },
    {
      icon: <EnvironmentOutlined />,
      label: "Địa chỉ",
      value: "Hà Nội, Việt Nam",
      link: null,
    },
  ];

  const quickLinks = [
    { label: "Tài liệu API", icon: <ApiOutlined />, path: "/docs/api" },
    {
      label: "Hướng dẫn sử dụng",
      icon: <ApartmentOutlined />,
      path: "/docs/guide",
    },
    {
      label: "Workflow Templates",
      icon: <ThunderboltOutlined />,
      path: "/templates",
    },
    {
      label: "Bảo mật",
      icon: <SafetyCertificateOutlined />,
      path: "/security",
    },
  ];

  const systemStats = [
    { label: "Uptime", value: "99.9%", color: "#52c41a" },
    { label: "Response Time", value: "< 200ms", color: "#1890ff" },
    { label: "Active Users", value: "1,234", color: "#fa8c16" },
    { label: "Workflows Processed", value: "45,678", color: "#722ed1" },
  ];

  return (
    <Layout.Footer
      style={{
        margin: "0 4px 4px 4px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,
        padding: "32px 24px 16px",
        border: `1px solid ${colorBorder}`,
        minHeight: 200,
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Brand and Description */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${colorPrimary}, ${colorPrimary}cc)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${colorPrimary}40`,
                }}
              >
                <ApartmentOutlined style={{ color: "white", fontSize: 20 }} />
              </div>
              <div>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    color: colorPrimary,
                    display: "block",
                  }}
                >
                  WorkFlow Pro
                </Text>
                <Text style={{ fontSize: 12, color: colorTextSecondary }}>
                  Advanced Management
                </Text>
              </div>
            </div>

            <Text
              style={{
                fontSize: 13,
                color: colorTextSecondary,
                lineHeight: 1.5,
              }}
            >
              Hệ thống quản lý workflow tiên tiến, giúp tự động hóa và tối ưu
              hóa quy trình làm việc của doanh nghiệp với hiệu suất cao và độ
              tin cậy tuyệt đối.
            </Text>

            <Space>
              <Link
                href="https://github.com"
                style={{ color: colorTextSecondary, fontSize: 16 }}
              >
                <GithubOutlined />
              </Link>
              <Link
                href="https://twitter.com"
                style={{ color: colorTextSecondary, fontSize: 16 }}
              >
                <TwitterOutlined />
              </Link>
              <Link
                href="https://workflow.pro"
                style={{ color: colorTextSecondary, fontSize: 16 }}
              >
                <GlobalOutlined />
              </Link>
            </Space>
          </Space>
        </Col>

        {/* Contact Information */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 14, color: colorText }}>
              Thông tin liên hệ
            </Text>

            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {contactInfo.map((contact, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      color: colorPrimary,
                      fontSize: 14,
                      minWidth: 20,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {contact.icon}
                  </div>
                  <div>
                    <Text
                      style={{
                        fontSize: 11,
                        color: colorTextSecondary,
                        display: "block",
                      }}
                    >
                      {contact.label}
                    </Text>
                    {contact.link ? (
                      <Link
                        href={contact.link}
                        style={{ fontSize: 12, color: colorText }}
                      >
                        {contact.value}
                      </Link>
                    ) : (
                      <Text style={{ fontSize: 12, color: colorText }}>
                        {contact.value}
                      </Text>
                    )}
                  </div>
                </div>
              ))}
            </Space>

            <div
              style={{
                padding: "12px",
                background: `${colorPrimary}08`,
                borderRadius: 8,
                border: `1px solid ${colorPrimary}20`,
              }}
            >
              <Space>
                <ClockCircleOutlined style={{ color: colorPrimary }} />
                <div>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colorTextSecondary,
                      display: "block",
                    }}
                  >
                    Hỗ trợ 24/7
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: colorText, fontWeight: 500 }}
                  >
                    Luôn sẵn sàng hỗ trợ
                  </Text>
                </div>
              </Space>
            </div>
          </Space>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 14, color: colorText }}>
              Liên kết nhanh
            </Text>

            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  type="text"
                  size="small"
                  icon={React.cloneElement(link.icon, {
                    style: { color: colorPrimary, fontSize: 12 },
                  })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "4px 8px",
                    height: 32,
                    color: colorText,
                    fontSize: 12,
                    border: "none",
                  }}
                  onClick={() => console.log(`Navigate to ${link.path}`)}
                >
                  {link.label}
                </Button>
              ))}
            </Space>

            <Divider style={{ margin: "12px 0", borderColor: colorBorder }} />

            <div>
              <Text
                style={{
                  fontSize: 11,
                  color: colorTextSecondary,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Phiên bản hệ thống
              </Text>
              <Space>
                <Text code style={{ fontSize: 11 }}>
                  v2.1.0
                </Text>
                <Text style={{ fontSize: 10, color: colorTextSecondary }}>
                  Build 2024.01.15
                </Text>
              </Space>
            </div>
          </Space>
        </Col>

        {/* System Statistics */}
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 14, color: colorText }}>
              Thống kê hệ thống
            </Text>

            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {systemStats.map((stat, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: `${stat.color}08`,
                    borderRadius: 6,
                    border: `1px solid ${stat.color}20`,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colorText }}>
                    {stat.label}
                  </Text>
                  <Text strong style={{ fontSize: 12, color: stat.color }}>
                    {stat.value}
                  </Text>
                </div>
              ))}
            </Space>

            <div
              style={{
                padding: "12px",
                background: `${colorPrimary}08`,
                borderRadius: 8,
                border: `1px solid ${colorPrimary}20`,
                textAlign: "center",
              }}
            >
              <TeamOutlined
                style={{ color: colorPrimary, fontSize: 16, marginBottom: 4 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  color: colorTextSecondary,
                  display: "block",
                }}
              >
                Trusted by
              </Text>
              <Text strong style={{ fontSize: 12, color: colorPrimary }}>
                100+ Organizations
              </Text>
            </div>
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: "24px 0 16px", borderColor: colorBorder }} />

      {/* Bottom Section */}
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={12}>
          <Space
            split={
              <Divider type="vertical" style={{ borderColor: colorBorder }} />
            }
          >
            <Text style={{ color: colorTextSecondary, fontSize: 12 }}>
              © {currentYear} WorkFlow Pro. All rights reserved.
            </Text>
            <Space>
              <Text style={{ color: colorTextSecondary, fontSize: 12 }}>
                Phát triển bởi
              </Text>
              <Text strong style={{ color: colorPrimary, fontSize: 12 }}>
                Nguyễn Thanh Sang
              </Text>
              <HeartFilled style={{ color: "#ff4d4f", fontSize: 10 }} />
            </Space>
          </Space>
        </Col>

        <Col xs={24} sm={12} style={{ textAlign: "right" }}>
          <Space
            split={
              <Divider type="vertical" style={{ borderColor: colorBorder }} />
            }
          >
            <Link
              href="/privacy"
              style={{ color: colorTextSecondary, fontSize: 11 }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              style={{ color: colorTextSecondary, fontSize: 11 }}
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              style={{ color: colorTextSecondary, fontSize: 11 }}
            >
              Support
            </Link>
          </Space>
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default FooterComponent;
