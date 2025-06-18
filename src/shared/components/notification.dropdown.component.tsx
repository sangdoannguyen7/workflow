import { Badge, Button, Divider, Dropdown, MenuProps, theme } from "antd";
import {
  BellOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { cloneElement } from "react";

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (<Link target="_blank" to=''>Thông tin cá nhân</Link>),
    // icon: (
    //   <Badge.Ribbon text="Hippies" color="pink" placement="start">
    //     and raises the spyglass.
    //   </Badge.Ribbon>
    // )
  },
];

const NotificationDropdown = () => {

  const {
    token: { colorBgElevated, borderRadiusLG, boxShadowSecondary },
  } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  return (
    <Dropdown menu={{items}} placement="bottom" dropdownRender={(items2) => (
      <div style={contentStyle}>
        {cloneElement(items2 as React.ReactElement, { style: menuStyle })}
        <Divider style={{ margin: 0 }} />
        <Button type="primary" style={{display: 'flex', justifyContent: 'center', width: '100%'}}>Xem tất cả</Button>
      </div>
    )}>
      <Badge style={{marginRight: 52, marginTop: 20}} count={10} overflowCount={9}>
        <BellOutlined style={{fontSize: 20, marginRight: 60, marginTop: 20}}/>
      </Badge>
    </Dropdown>
  )
}

export default NotificationDropdown;
