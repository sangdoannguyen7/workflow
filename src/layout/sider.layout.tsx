import { Image, Layout, Menu, theme } from 'antd';
import { useSelector } from 'react-redux';
import { IState } from '../interface/action.interface';
import menuData from '../common/common.menudata.tsx';
import React from 'react';

import logo from '../images/logo.png';
// import { useEffect, useState } from 'react';
// const permission = ["DASHBOARD_ADMIN", "BOOKING_ADMIN", "HOTEL_ADMIN"]

const SiderLayout = () => {

  const collapseStore = useSelector((state: IState) => state.getCollapsed);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [permissions, setPermissions] = useState([] as any);

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const per = [] as any;
  //   menuData.admin.map((data) => {
  //     permission.map((me) => {
  //       if(data.permission === me) {
  //         per.push(data);
  //       }
  //     })
  //   })
  //   setPermissions(per);
  //   console.log('render');
  // }, [])

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const style: React.CSSProperties = { 
    margin: '-8px', 
    height: '100vh', 
    position: 'sticky', 
    top: 0, 
    zIndex: 1, 
    backgroundColor: colorBgContainer
  };

  return (
    <Layout.Sider style={style} 
                  trigger={null} collapsible 
                  collapsed={collapseStore?.type === 'large'}>
      {/* <div style={{backgroundColor: 'red', width: 180, height: 100}}></div> */}
      <Image style={{marginTop: 16, marginBottom: 16}}
             src={logo} preview={false}
             onClick={() => {
                 window.location.href = '/customer/residences'
             }}/>
      <div className="demo-logo-vertical" />
      <Menu
        theme="light"
        mode="inline"
        // style={{maxHeight: window.innerHeight/1.3, overflowY: 'auto'}}
        defaultSelectedKeys={['1']}
        defaultValue={1}
        defaultActiveFirst={true}
        items={menuData}
      />
    </Layout.Sider>
  )
}

export default SiderLayout;
