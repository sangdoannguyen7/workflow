import { Layout } from "antd";
import { useSelector } from "react-redux";
import { IState } from "../interface/action.interface";
import SiderLayout from "./sider.layout";
import HeaderComponent from "./header.layout";
import FooterComponent from "./footer.layout";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const collapseStore = useSelector((state: IState) => state.getCollapsed);
  const isCollapsed = collapseStore?.type === "large";
  const siderWidth = isCollapsed ? 80 : 200;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderLayout />
      <Layout
        style={{
          marginLeft: siderWidth,
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
        }}
      >
        <HeaderComponent />
        <Layout.Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            minHeight: "calc(100vh - 160px)",
          }}
        >
          {children}
        </Layout.Content>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
