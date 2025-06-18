import { Avatar, Button, Dropdown, Layout, Switch, theme } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MoonIcon from "../shared/icons/moon.icon";
import SunIcon from "../shared/icons/sun.icon";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../interface/action.interface";
import { useDarkMode, useLightMode } from "../redux/actions/theme.action";
import {
  useCollapsedLarge,
  useCollapsedSmall,
} from "../redux/actions/collapsed.action";

// import logo from "../images/logo.png";

const HeaderLayout = () => {
  const dispatch = useDispatch();

  const themeStore = useSelector((state: IState) => state.getTheme);
  const collapseStore = useSelector((state: IState) => state.getCollapsed);

  const nextTheme = themeStore.type === "dark" ? useLightMode : useDarkMode;
  const nextCollapse =
    collapseStore.type === "large" ? useCollapsedSmall : useCollapsedLarge;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Header
      style={{
        margin: "0 16px 0 0",
        padding: "0 24px",
        background: colorBgContainer,
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        height: "64px",
        lineHeight: "64px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Button
          type="text"
          icon={
            nextCollapse().type === "small" ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )
          }
          onClick={() => dispatch(nextCollapse())}
          style={{
            fontSize: "16px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/*<Tooltip title='aaa'>*/}
          {/*  <span>*/}
          {/*    {createElement(colorBgContainer === 'dark' ? SunSvg : MoonSvg, {*/}
          {/*      onClick: dispatch(nextTheme()),*/}
          {/*    })}*/}
          {/*  </span>*/}
          {/*</Tooltip>*/}
          <Switch
            style={{ marginRight: 24 }}
            checkedChildren={<MoonIcon />}
            unCheckedChildren={<SunIcon />}
            onChange={() => dispatch(nextTheme())}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  icon: <UserOutlined />,
                  label: (
                    <span onClick={() => console.log("dashboard")}>
                      Cá nhân
                      {/*<LocaleFormatter id="header.avator.account" />*/}
                    </span>
                  ),
                },
                {
                  key: "2",
                  icon: <LogoutOutlined />,
                  label: (
                    <span onClick={() => console.log("logout")}>
                      Đăng xuất
                      {/*<LocaleFormatter id="header.avator.logout" />*/}
                    </span>
                  ),
                },
              ],
            }}
          >
            <Avatar
              src={
                <img
                  src={"https://api.dicebear.com/7.x/miniavs/svg?seed=3"}
                  alt="avatar"
                />
              }
              size={32}
              // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            />
          </Dropdown>
          {/* <NotificationDropdown />
          <AvatarDropdown /> */}
        </div>
      </div>
    </Layout.Header>
  );
};

export default HeaderLayout;
