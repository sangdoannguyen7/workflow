import { App as AntApp, ConfigProvider, theme as themeAntd } from "antd";
import { useSelector } from "react-redux";
import { IState } from "./interface/action.interface";
import RenderRouter from "./routers/router.view";
import { setGlobalNotificationApi } from "./shared/components/notification/notification";
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
        // Color tokens based on user specifications
        colorPrimary: isDark ? "#90CAF9" : "#1976D2",
        colorSuccess: isDark ? "#A5D6A7" : "#388E3C",
        colorWarning: isDark ? "#FFB74D" : "#F57C00",
        colorError: isDark ? "#EF9A9A" : "#D32F2F",
        colorInfo: isDark ? "#81D4FA" : "#0288D1",

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

        // Layout background based on user specifications
        colorBgLayout: isDark ? "#121212" : "#FFFFFF",
        colorBgContainer: isDark ? "#1E1E1E" : "#FFFFFF",
        colorBgElevated: isDark ? "#2C2C2C" : "#F5F5F5",

        // Border colors based on user specifications
        colorBorder: isDark ? "#444444" : "#E0E0E0",
        colorBorderSecondary: isDark ? "#333333" : "#DADADA",

        // Text colors based on user specifications
        colorText: isDark ? "#FFFFFF" : "#000000",
        colorTextSecondary: isDark ? "#CCCCCC" : "#666666",
        colorTextTertiary: isDark ? "#AAAAAA" : "#757575",

        // Shadow tokens
        boxShadow: isDark
          ? "0 1px 2px 0 rgba(0, 0, 0, 0.6), 0 1px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.4)"
          : "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        boxShadowSecondary: isDark
          ? "0 6px 16px 0 rgba(0, 0, 0, 0.4), 0 3px 6px -4px rgba(0, 0, 0, 0.6), 0 9px 28px 8px rgba(0, 0, 0, 0.3)"
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
          headerBg: isDark ? "#1E1E1E" : "#FFFFFF",
          siderBg: isDark ? "#1E1E1E" : "#FFFFFF",
          bodyBg: isDark ? "#121212" : "#FFFFFF",
        },
        Menu: {
          itemBg: "transparent",
          itemSelectedBg: isDark
            ? "rgba(144, 202, 249, 0.15)"
            : "rgba(25, 118, 210, 0.1)",
          itemHoverBg: isDark
            ? "rgba(144, 202, 249, 0.08)"
            : "rgba(25, 118, 210, 0.05)",
          itemSelectedColor: isDark ? "#90CAF9" : "#1976D2",
        },
        Card: {
          headerBg: isDark ? "#2C2C2C" : "#F5F5F5",
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
          headerBg: isDark ? "#2C2C2C" : "#F5F5F5",
          headerSortActiveBg: isDark ? "#333333" : "#E0E0E0",
          headerSortHoverBg: isDark ? "#333333" : "#DADADA",
          rowHoverBg: isDark
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(0, 0, 0, 0.02)",
        },
        Tabs: {
          itemHoverColor: isDark ? "#90CAF9" : "#1976D2",
          itemSelectedColor: isDark ? "#90CAF9" : "#1976D2",
          inkBarColor: isDark ? "#90CAF9" : "#1976D2",
        },
        Switch: {
          colorPrimary: isDark ? "#90CAF9" : "#1976D2",
          colorPrimaryHover: isDark ? "#90CAF9" : "#1976D2",
        },
        Progress: {
          colorSuccess: isDark ? "#A5D6A7" : "#388E3C",
          colorWarning: isDark ? "#FFB74D" : "#F57C00",
          colorError: isDark ? "#EF9A9A" : "#D32F2F",
        },
        Tag: {
          borderRadiusSM: Math.max((theme.borderRadius || 8) - 2, 4),
        },
        Notification: {
          colorBgElevated: isDark ? "#2C2C2C" : "#FFFFFF",
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
