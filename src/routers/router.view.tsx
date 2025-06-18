import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderLayout from "../layout/sider.layout";
import { Layout, FloatButton } from "antd";
import {
  QuestionCircleOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../layout/header.layout";
import FooterComponent from "../layout/footer.layout";
import NotfoundPage from "../views/exception/notfound.view";
import UserPage from "../views/user/view.user.tsx";
import GroupPage from "../views/group/view.group.tsx";
import PermissionPage from "../views/permisison/view.permission.tsx";
import SitePage from "../views/site/view.site.tsx";
import CalendarPage from "../views/calendar/view.calendar.tsx";
import DashboardPage from "../views/dashboard/view.dashboard.tsx";
import AgentPage from "../views/agent/view.agent.tsx";
import TemplatePage from "../views/template/view.template.tsx";
import NodePage from "../views/node/view.node.tsx";
import WorkflowPage from "../views/workflow/view.workflow.tsx";
import WorkflowDesignerPage from "../views/workflow/view.workflow-designer.tsx";
import NodeFlowPage from "../views/node-flow/view.node-flow.tsx";
import WorkflowBuilderPage from "../views/workflow-builder/view.workflow-builder.tsx";
import ManagementPage from "../views/management/view.management.tsx";

const RenderRouter = () => {
  const showHelpGuide = () => {
    // This will be implemented as a tour/guide system
    console.log("Showing help guide...");
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <SiderLayout />
        <Layout
          style={{
            marginLeft: 4,
            transition: "all 0.2s",
            background: "transparent",
          }}
        >
          <HeaderComponent />
          <Layout.Content
            style={{
              margin: "4px 4px 0 4px",
              padding: "8px",
              borderRadius: 12,
              minHeight: "calc(100vh - 120px)",
              overflow: "auto",
              background: "transparent",
            }}
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/account" element={<UserPage />} />
              <Route path="/group" element={<GroupPage />} />
              <Route path="/permission" element={<PermissionPage />} />
              <Route path="/site" element={<SitePage />} />
              <Route path="/hotel" element={<UserPage />} />
              <Route path="/room" element={<UserPage />} />
              <Route path="/order" element={<UserPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/price" element={<UserPage />} />
              <Route path="/rating" element={<UserPage />} />
              <Route path="/statistic" element={<UserPage />} />
              <Route path="/agent" element={<AgentPage />} />
              <Route path="/template" element={<TemplatePage />} />
              <Route path="/node" element={<NodePage />} />
              <Route path="/workflow" element={<WorkflowPage />} />
              <Route
                path="/workflow-designer"
                element={<WorkflowDesignerPage />}
              />
              <Route
                path="/workflow-designer/:workflowCode"
                element={<WorkflowDesignerPage />}
              />
              <Route path="/node-flow" element={<NodeFlowPage />} />
              <Route
                path="/workflow-builder"
                element={<WorkflowBuilderPage />}
              />
              <Route path="/management" element={<ManagementPage />} />
              <Route path="*" element={<NotfoundPage />} />
            </Routes>
          </Layout.Content>
          <FooterComponent />
        </Layout>
      </Layout>

      {/* Help FloatButton */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="Hướng dẫn sử dụng"
          onClick={showHelpGuide}
        />
      </FloatButton.Group>
    </BrowserRouter>
  );
};

export default RenderRouter;
