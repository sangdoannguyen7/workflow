import { Image, Layout, Menu, theme } from "antd";
import { useSelector } from "react-redux";
import { IState } from "../interface/action.interface";
import menuData from "../common/common.menudata.tsx";
import React from "react";

import logo from "../images/logo.png";
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
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
    backgroundColor: colorBgContainer,
    borderRight: "1px solid #f0f0f0",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.06)",
  };

  return (
    <Layout.Sider
      style={style}
      trigger={null}
      collapsible
      collapsed={collapseStore?.type === "large"}
    >
      {/* <div style={{backgroundColor: 'red', width: 180, height: 100}}></div> */}
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: "8px",
        }}
      >
        <Image
          style={{
            maxWidth: "120px",
            height: "auto",
            cursor: "pointer",
          }}
          src={logo}
          preview={false}
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        />
      </div>
      <div className="demo-logo-vertical" />
      <Menu
        theme="light"
        mode="inline"
        // style={{maxHeight: window.innerHeight/1.3, overflowY: 'auto'}}
        defaultSelectedKeys={["1"]}
        defaultValue={1}
        defaultActiveFirst={true}
        items={menuData}
      />
    </Layout.Sider>
  );
};

export default SiderLayout;
