import {
  DashboardOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  TeamOutlined,
  PieChartOutlined,
  BuildOutlined,
  UserOutlined,
  AimOutlined,
  StarOutlined,
  DollarOutlined,
  ScheduleOutlined,
  RobotOutlined,
  FileTextOutlined,
  NodeExpandOutlined,
  ApartmentOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const menuData = [
  // {
  //   path: '/admin/dashboard',
  //   key: 'DASHBOARD_ADMIN',
  //   icon: <Link to='/admin/dashboard'><DashboardOutlined /></Link>,
  //   label: 'Trang chủ',
  //   permission: 'DASHBOARD_ADMIN',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/admin/orders',
  //   key: 'BOOKING_ADMIN',
  //   icon: <Link to='/admin/orders'><ShoppingCartOutlined /></Link>,
  //   label: 'Quản lý đơn',
  //   permission: 'BOOKING_ADMIN',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/admin/hotels',
  //   key: 'HOTEL_ADMIN',
  //   icon: <Link to='/admin/hotels'><BankOutlined /></Link>,
  //   label: 'Quản lý khách sạn',
  //   permission: 'HOTEL_ADMIN',
  //   description: 'ADMIN',
  //   // children: []
  // },
  // {
  //   path: '/admin/profit',
  //   key: 'PROFIT_ADMIN',
  //   icon: <Link to='/admin/profit'><AccountBookOutlined /></Link>,
  //   label: 'Chiết khấu',
  //   permission: 'PROFIT_ADMIN',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/admin/revenue',
  //   key: 'REVENUE_ADMIN',
  //   icon: <Link to='/admin/revenue'><DollarOutlined /></Link>,
  //   label: 'Doanh thu',
  //   permission: 'REVENUE_ADMIN',
  //   description: 'ADMIN',
  //   // children: []
  // },
  // {
  //   path: '/admin/statistic',
  //   key: 'STATISTIC_ADMIN',
  //   icon: <Link to='/admin/statistic'><PieChartOutlined /></Link>,
  //   label: 'Thống kê',
  //   permission: 'STATISTIC_ADMIN',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/admin/permissions',
  //   key: 'PERMISSION',
  //   icon: <Link to='/admin/permissions'><AppstoreOutlined /></Link>,
  //   label: 'Quản lý quyền',
  //   permission: 'PERMISSION',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/admin/groups',
  //   key: 'USER_GROUP',
  //   icon: <Link to='/admin/groups'><UsergroupAddOutlined /></Link>,
  //   label: 'Nhóm người dùng',
  //   permission: 'USER_GROUP',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/admin/users',
  //   key: 'USER_ADMIN',
  //   icon: <Link to='/admin/users'><UserOutlined /></Link>,
  //   label: 'Quản lý người dùng',
  //   permission: 'USER_ADMIN',
  //   description: 'ADMIN'
  // },
  // {
  //   path: '/dashboard',
  //   key: 'DASHBOARD_HOTEL',
  //   icon: <Link to='/dashboard'><DashboardOutlined /></Link>,
  //   label: 'Trang chủ',
  //   permission: 'DASHBOARD_HOTEL',
  //   description: 'HOTEL'
  // },
  // {
  //   path: '/orders',
  //   key: 'BOOKING_HOTEL',
  //   icon: <Link to='/orders'><ShoppingCartOutlined /></Link>,
  //   label: 'Quản lý đơn',
  //   permission: 'BOOKING_HOTEL',
  //   description: 'HOTEL'
  // },
  // {
  //   path: '/hotels',
  //   key: 'HOTEL_HOTEL',
  //   icon: <Link to='/hotels'><BankOutlined /></Link>,
  //   label: 'Quản lý khách sạn',
  //   permission: 'HOTEL_HOTEL',
  //   description: 'HOTEL'
  // },
  // {
  //   path: '/users',
  //   key: 'USER_HOTEL',
  //   icon: <Link to='/users'><UsergroupAddOutlined /></Link>,
  //   label: 'Quản lý người dùng',
  //   permission: 'USER_HOTEL',
  //   description: 'HOTEL'
  // },
  // {
  //   path: '/statistic',
  //   key: 'STATISTIC_HOTEL',
  //   icon: <Link to='/statistic'><PieChartOutlined /></Link>,
  //   label: 'Thông kê',
  //   permission: 'STATISTIC_HOTEL',
  //   description: 'HOTEL'
  // },
  {
    path: "/dashboard",
    key: "DASHBOARD",
    icon: (
      <Link to="/dashboard">
        <DashboardOutlined />
      </Link>
    ),
    label: "Trang chủ",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  // {
  //     path: '/user',
  //     key: 'USER',
  //     icon: <Link to='/user'><UserOutlined /></Link>,
  //     label: 'Tài khoản',
  // },
  {
    path: "/account",
    key: "ACCOUNT",
    icon: (
      <Link to="/account">
        <UserOutlined />
      </Link>
    ),
    label: "Tài khoản",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/group",
    key: "GROUP",
    icon: (
      <Link to="/group">
        <TeamOutlined />
      </Link>
    ),
    label: "Nhóm người dùng",
    permission: "GROUP",
    description: "GROUP",
  },
  {
    path: "/permission",
    key: "PERMISSION",
    icon: (
      <Link to="/permission">
        <BuildOutlined />
      </Link>
    ),
    label: "Quyền",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/site",
    key: "SITE",
    icon: (
      <Link to="/site">
        <AimOutlined />
      </Link>
    ),
    label: "Địa danh",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/hotel",
    key: "HOTEL",
    icon: (
      <Link to="/hotel">
        <HomeOutlined />
      </Link>
    ),
    label: "Khách sạn",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/room",
    key: "ROOM",
    icon: (
      <Link to="/room">
        <HomeOutlined />
      </Link>
    ),
    label: "Phòng",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/order",
    key: "ORDER",
    icon: (
      <Link to="/order">
        <ShoppingCartOutlined />
      </Link>
    ),
    label: "Đơn đặt",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  // {
  //   path: '/schedule',
  //   key: 'SCHEDULE',
  //   icon: <Link to='/schedule'><ScheduleOutlined /></Link>,
  //   label: 'Lịch trình',
  //   permission: 'SCHEDULE',
  //   description: 'SCHEDULE',
  // },
  {
    path: "/calendar",
    key: "CALENDAR",
    icon: (
      <Link to="/calendar">
        <ScheduleOutlined />
      </Link>
    ),
    label: "Lịch trình",
    permission: "CALENDAR",
    description: "CALENDAR",
  },
  {
    path: "/price",
    key: "PRICE",
    icon: (
      <Link to="/price">
        <DollarOutlined />
      </Link>
    ),
    label: "Quản lý giá",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/rating",
    key: "RATING",
    icon: (
      <Link to="/rating">
        <StarOutlined />
      </Link>
    ),
    label: "Đánh giá",
    permission: "DASHBOARD",
    description: "DASHBOARD",
  },
  {
    path: "/statistic",
    key: "STATISTIC",
    icon: (
      <Link to="/statistic">
        <PieChartOutlined />
      </Link>
    ),
    label: "Thống kê",
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
  // {
  //   path: '/hotel/list',
  //   key: 'HOTEL_LIST',
  //   icon: <Link to='/statistic'><BankOutlined /></Link>,
  //   label: 'D/S khách sạn',
  //   permission: 'DASHBOARD',
  //   description: 'DASHBOARD',
  //   children: []
  // },
];

export default menuData;
