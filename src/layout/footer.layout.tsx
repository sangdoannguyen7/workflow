import { Layout, theme, Space, Typography, Divider } from "antd";
import {
  HeartFilled,
  GithubOutlined,
  TwitterOutlined,
  GlobalOutlined,
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
    },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  return (
    <Layout.Footer
      style={{
        margin: "0 4px 4px 4px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        boxShadow: boxShadowSecondary,
        padding: "16px 24px",
        textAlign: "center",
        border: "1px solid #f0f0f0",
      }}
    >
      <Space split={<Divider type="vertical" />} size="large" wrap>
        <Text style={{ color: colorTextSecondary, fontSize: 13 }}>
          © {currentYear} Travel Admin System
        </Text>

        <Space size="small">
          <Text style={{ color: colorTextSecondary, fontSize: 13 }}>
            Phát triển bởi
          </Text>
          <Text
            strong
            style={{
              color: colorPrimary,
              fontSize: 13,
            }}
          >
            Nguyễn Thanh Sang
          </Text>
          <HeartFilled style={{ color: "#ff4d4f", fontSize: 12 }} />
        </Space>

        <Space size="middle">
          <Link
            href="#"
            style={{ color: colorTextSecondary, fontSize: 14 }}
            onClick={() => console.log("github")}
          >
            <GithubOutlined />
          </Link>
          <Link
            href="#"
            style={{ color: colorTextSecondary, fontSize: 14 }}
            onClick={() => console.log("twitter")}
          >
            <TwitterOutlined />
          </Link>
          <Link
            href="#"
            style={{ color: colorTextSecondary, fontSize: 14 }}
            onClick={() => console.log("website")}
          >
            <GlobalOutlined />
          </Link>
        </Space>

        <Text style={{ color: colorTextSecondary, fontSize: 12 }}>v2.0.0</Text>
      </Space>
    </Layout.Footer>
  );
};

export default FooterComponent;
