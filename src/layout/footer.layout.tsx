import { Layout, theme } from "antd";

const FooterComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Footer
      style={{
        margin: "8px 16px 0 0",
        padding: "16px 24px",
        background: colorBgContainer,
        borderRadius: "8px 8px 0 0",
        textAlign: "center",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.06)",
        fontSize: "14px",
        color: "#666",
      }}
    >
      Trải nghiệm travel © 2023 Phát triển bởi Nguyễn Thanh Sang
    </Layout.Footer>
  );
};

export default FooterComponent;
