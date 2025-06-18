import {
  RobotOutlined,
  FileTextOutlined,
  NodeExpandOutlined,
  ApartmentOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const menuData = [
  {
    path: "/dashboard",
    key: "DASHBOARD",
    icon: (
      <Link to="/dashboard">
        <DashboardOutlined />
      </Link>
    ),
    label: "Dashboard",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/agent",
    key: "AGENT",
    icon: (
      <Link to="/agent">
        <RobotOutlined />
      </Link>
    ),
    label: "Quản lý Agent",
    permission: "AGENT",
    description: "AGENT",
  },
  {
    path: "/template",
    key: "TEMPLATE",
    icon: (
      <Link to="/template">
        <FileTextOutlined />
      </Link>
    ),
    label: "Quản lý Template",
    permission: "TEMPLATE",
    description: "TEMPLATE",
  },
  {
    path: "/node",
    key: "NODE",
    icon: (
      <Link to="/node">
        <NodeExpandOutlined />
      </Link>
    ),
    label: "Quản lý Node",
    permission: "NODE",
    description: "NODE",
  },
  {
    path: "/workflow",
    key: "WORKFLOW",
    icon: (
      <Link to="/workflow">
        <ApartmentOutlined />
      </Link>
    ),
    label: "Quản lý Workflow",
    permission: "WORKFLOW",
    description: "WORKFLOW",
  },
  {
    path: "/node-flow",
    key: "NODE_FLOW",
    icon: (
      <Link to="/node-flow">
        <ApartmentOutlined />
      </Link>
    ),
    label: "Thiết kế Node Flow",
    permission: "NODE_FLOW",
    description: "NODE_FLOW",
  },
  {
    path: "/workflow-builder",
    key: "WORKFLOW_BUILDER",
    icon: (
      <Link to="/workflow-builder">
        <ApartmentOutlined />
      </Link>
    ),
    label: "Workflow Builder",
    permission: "WORKFLOW_BUILDER",
    description: "WORKFLOW_BUILDER",
  },
  {
    path: "/management",
    key: "MANAGEMENT",
    icon: (
      <Link to="/management">
        <SettingOutlined />
      </Link>
    ),
    label: "Property Management",
    permission: "MANAGEMENT",
    description: "MANAGEMENT",
  },
];

export default menuData;
