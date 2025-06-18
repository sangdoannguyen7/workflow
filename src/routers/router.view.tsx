import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/main.layout";
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
import WorkflowTestPage from "../views/workflow-test.tsx";

const RenderRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
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
          <Route path="/workflow-designer" element={<WorkflowDesignerPage />} />
          <Route
            path="/workflow-designer/:workflowCode"
            element={<WorkflowDesignerPage />}
          />
          <Route path="/node-flow" element={<NodeFlowPage />} />
          <Route path="/workflow-builder" element={<WorkflowBuilderPage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="*" element={<NotfoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default RenderRouter;
