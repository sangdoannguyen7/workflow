import {
  RobotOutlined,
  FileTextOutlined,
  NodeExpandOutlined,
  ApartmentOutlined,
  SettingOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
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
];

export default menuData;
