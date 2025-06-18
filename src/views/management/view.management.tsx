import React, { useState } from "react";
import { Tabs, Card, theme } from "antd";
import {
  RobotOutlined,
  FileTextOutlined,
  NodeExpandOutlined,
  ApartmentOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// Import management components
import AgentPage from "../agent/view.agent";
import TemplatePage from "../template/view.template";
import NodePage from "../node/view.node";
import WorkflowPage from "../workflow/view.workflow";
import WorkflowBuilderEnhanced from "../workflow-builder/view.workflow-builder-enhanced";

const { TabPane } = Tabs;

const ManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("agents");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const tabItems = [
    {
      key: "agents",
      label: (
        <span>
          <RobotOutlined />
          Agents
        </span>
      ),
      children: <AgentPage />,
    },
    {
      key: "templates",
      label: (
        <span>
          <FileTextOutlined />
          Templates
        </span>
      ),
      children: <TemplatePage />,
    },
    {
      key: "nodes",
      label: (
        <span>
          <NodeExpandOutlined />
          Nodes
        </span>
      ),
      children: <NodePage />,
    },
    {
      key: "workflows",
      label: (
        <span>
          <ApartmentOutlined />
          Workflows
        </span>
      ),
      children: <WorkflowPage />,
    },
    {
      key: "builder",
      label: (
        <span>
          <SettingOutlined />
          Workflow Builder
        </span>
      ),
      children: <WorkflowBuilderEnhanced />,
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        background: colorBgContainer,
        borderRadius: "8px",
        height: "calc(100vh - 64px)",
        overflow: "auto",
      }}
    >
      <Card
        title="Property Management System"
        style={{ height: "100%" }}
        bodyStyle={{ padding: "24px 0", height: "calc(100% - 57px)" }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          style={{ height: "100%" }}
          tabBarStyle={{ marginBottom: "16px" }}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default ManagementPage;
