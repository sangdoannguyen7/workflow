import { App as AntApp, ConfigProvider, theme as themeAntd } from "antd";
import { useSelector } from "react-redux";
import { IState } from "./interface/action.interface";
import RenderRouter from "./routers/router.view";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  const theme = useSelector((state: IState) => state.getTheme);

  // Enhanced theme configuration
  const getThemeConfig = () => {
    const isDark = theme.type === "dark";

    return {
      algorithm: isDark ? themeAntd.darkAlgorithm : themeAntd.defaultAlgorithm,
      token: {
        // Color tokens
        colorPrimary: theme.primaryColor || "#1890ff",
        colorSuccess: "#52c41a",
        colorWarning: "#faad14",
        colorError: "#ff4d4f",
        colorInfo: "#1890ff",

        // Layout tokens
        borderRadius: theme.borderRadius || 8,
        borderRadiusLG: (theme.borderRadius || 8) + 4,
        borderRadiusSM: Math.max((theme.borderRadius || 8) - 2, 4),

        // Component size tokens
        controlHeight: theme.compactMode ? 28 : 32,
        controlHeightLG: theme.compactMode ? 36 : 40,
        controlHeightSM: theme.compactMode ? 20 : 24,

        // Typography tokens
        fontSize: theme.compactMode ? 13 : 14,
        fontSizeLG: theme.compactMode ? 15 : 16,
        fontSizeSM: theme.compactMode ? 11 : 12,

        // Layout background for dark mode
        colorBgLayout: isDark ? "#000000" : "#f0f2f5",
        colorBgContainer: isDark ? "#141414" : "#ffffff",
        colorBgElevated: isDark ? "#1f1f1f" : "#ffffff",

        // Border colors
        colorBorder: isDark ? "#424242" : "#d9d9d9",
        colorBorderSecondary: isDark ? "#303030" : "#f0f0f0",

        // Text colors
        colorText: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.85)",
        colorTextSecondary: isDark
          ? "rgba(255, 255, 255, 0.65)"
          : "rgba(0, 0, 0, 0.65)",
        colorTextTertiary: isDark
          ? "rgba(255, 255, 255, 0.45)"
          : "rgba(0, 0, 0, 0.45)",

        // Shadow tokens
        boxShadow: isDark
          ? "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)"
          : "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        boxShadowSecondary: isDark
          ? "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)"
          : "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",

        // Motion tokens
        motionDurationFast: "0.1s",
        motionDurationMid: "0.2s",
        motionDurationSlow: "0.3s",

        // Wireframe mode for development (set to false for production)
        wireframe: false,
      },
      components: {
        Layout: {
          headerBg: isDark ? "#001529" : "#ffffff",
          siderBg: isDark ? "#001529" : "#ffffff",
          bodyBg: isDark ? "#000000" : "#f0f2f5",
        },
        Menu: {
          itemBg: "transparent",
          itemSelectedBg: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : `${theme.primaryColor || "#1890ff"}10`,
          itemHoverBg: isDark
            ? "rgba(255, 255, 255, 0.04)"
            : `${theme.primaryColor || "#1890ff"}05`,
          itemSelectedColor: theme.primaryColor || "#1890ff",
        },
        Card: {
          headerBg: isDark ? "#1f1f1f" : "#fafafa",
          paddingLG: theme.compactMode ? 16 : 24,
        },
        Button: {
          borderRadius: theme.borderRadius || 8,
          controlHeight: theme.compactMode ? 28 : 32,
        },
        Input: {
          borderRadius: theme.borderRadius || 8,
          controlHeight: theme.compactMode ? 28 : 32,
        },
        Select: {
          borderRadius: theme.borderRadius || 8,
          controlHeight: theme.compactMode ? 28 : 32,
        },
        Table: {
          headerBg: isDark ? "#1f1f1f" : "#fafafa",
          headerSortActiveBg: isDark ? "#262626" : "#f0f0f0",
          headerSortHoverBg: isDark ? "#262626" : "#f5f5f5",
          rowHoverBg: isDark
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(0, 0, 0, 0.02)",
        },
        Tabs: {
          itemHoverColor: theme.primaryColor || "#1890ff",
          itemSelectedColor: theme.primaryColor || "#1890ff",
          inkBarColor: theme.primaryColor || "#1890ff",
        },
        Switch: {
          colorPrimary: theme.primaryColor || "#1890ff",
          colorPrimaryHover: theme.primaryColor || "#1890ff",
        },
        Progress: {
          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
        },
        Tag: {
          borderRadiusSM: Math.max((theme.borderRadius || 8) - 2, 4),
        },
        Notification: {
          colorBgElevated: isDark ? "#1f1f1f" : "#ffffff",
          borderRadiusLG: (theme.borderRadius || 8) + 4,
        },
        Modal: {
          borderRadiusLG: (theme.borderRadius || 8) + 4,
        },
        Drawer: {
          borderRadiusLG: (theme.borderRadius || 8) + 4,
        },
        Tooltip: {
          borderRadius: theme.borderRadius || 8,
        },
        Popover: {
          borderRadiusOuter: (theme.borderRadius || 8) + 4,
        },
      },
    };
  };

  return (
    <ConfigProvider
      locale={viVN}
      componentSize={theme.compactMode ? "small" : "middle"}
      theme={getThemeConfig()}
    >
      <AntApp>
        <RenderRouter />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
