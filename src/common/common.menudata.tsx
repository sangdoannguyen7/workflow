import {
  RobotOutlined,
  FileTextOutlined,
  NodeExpandOutlined,
  ApartmentOutlined,
  SettingOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  ClusterOutlined,
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
    label: "Tổng quan",
    permission: "DASHBOARD",
    description: "Dashboard tổng quan hệ thống",
  },
  {
    path: "/workflow",
    key: "WORKFLOW",
    icon: (
      <Link to="/workflow">
        <ApartmentOutlined />
      </Link>
    ),
    label: "Workflow",
    permission: "WORKFLOW",
    description: "Quản lý và giám sát workflow",
  },
  {
    path: "/workflow-builder",
    key: "WORKFLOW_BUILDER",
    icon: (
      <Link to="/workflow-builder">
        <ThunderboltOutlined />
      </Link>
    ),
    label: "Workflow Builder",
    permission: "WORKFLOW_BUILDER",
    description: "Thiết kế và xây dựng workflow",
  },
  {
    path: "/template",
    key: "TEMPLATE",
    icon: (
      <Link to="/template">
        <FileTextOutlined />
      </Link>
    ),
    label: "Template",
    permission: "TEMPLATE",
    description: "Quản lý template và mẫu",
  },
  {
    path: "/agent",
    key: "AGENT",
    icon: (
      <Link to="/agent">
        <RobotOutlined />
      </Link>
    ),
    label: "Agent",
    permission: "AGENT",
    description: "Quản lý agent và dịch vụ",
  },
  {
    path: "/node",
    key: "NODE",
    icon: (
      <Link to="/node">
        <NodeExpandOutlined />
      </Link>
    ),
    label: "Node",
    permission: "NODE",
    description: "Quản lý node và thành phần",
  },
  {
    path: "/node-flow",
    key: "NODE_FLOW",
    icon: (
      <Link to="/node-flow">
        <ClusterOutlined />
      </Link>
    ),
    label: "Node Flow",
    permission: "NODE_FLOW",
    description: "Thiết kế luồng node",
  },
  {
    path: "/management",
    key: "MANAGEMENT",
    icon: (
      <Link to="/management">
        <SettingOutlined />
      </Link>
    ),
    label: "Quản lý hệ thống",
    permission: "MANAGEMENT",
    description: "Cài đặt và quản lý hệ thống",
  },
];

export default menuData;
