import { Avatar, Divider, Dropdown, MenuProps, theme } from "antd";
import { LogoutOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { cloneElement, useEffect, useState } from "react";
// import {checkToken, getUserMe} from "../../apis/me/api.me.ts";
// import {IUserResponse} from "../../apis/me/api.me.interface.ts";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <Link target="_blank" to="">
        Thông tin cá nhân
      </Link>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <Link target="_blank" to="">
        Đổi mật khẩu
      </Link>
    ),
    icon: <KeyOutlined />,
  },
  {
    key: "3",
    label: "Đăng xuất",
    icon: <LogoutOutlined />,
    danger: true,
    onClick: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/customer/login";
    },
  },
];

const AvatarDropdown = () => {
  const [infoMe, setInfoMe] = useState({} as any);

  const {
    token: { colorBgElevated, borderRadiusLG, boxShadowSecondary },
  } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  useEffect(() => {
    // Temporarily disabled for demo
    // async function auth() {
    //   return await checkToken();
    // }
    // async function getInfoMe() {
    //   const infoMe = await getUserMe();
    //   setInfoMe(infoMe);
    // }

    // auth().then(() => {
    //   getInfoMe();
    // }).catch(() => {
    //   window.location.href = "/customer/login"
    // });

    // Mock data for demo
    setInfoMe({
      fullname: "Demo User",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=demo",
    });
  }, []);

  return (
    <Dropdown
      menu={{ items }}
      dropdownRender={(menu) => (
        <div style={contentStyle}>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 14,
              paddingTop: 20,
            }}
          >
            {infoMe.fullname}
          </p>
          <Divider style={{ margin: 0 }} />
          {cloneElement(menu as React.ReactElement, { style: menuStyle })}
        </div>
      )}
    >
      <Avatar src={infoMe.avatar} />
    </Dropdown>
  );
};

export default AvatarDropdown;
