import { App as AntApp, ConfigProvider, theme as themeAntd } from "antd";
import { useSelector } from "react-redux";
import { IState } from "./interface/action.interface";
import RenderRouter from "./routers/router.view";
import viVN from "antd/es/locale/vi_VN"; // Import Vietnamese locale
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

// Initialize mock data (disabled for real API)
// import './mock';

dayjs.extend(weekday);
dayjs.extend(localeData);

function App() {
  const theme = useSelector((state: IState) => state.getTheme);

  return (
    <ConfigProvider
      locale={viVN}
      componentSize="middle"
      theme={{
        algorithm:
          theme.type === "dark"
            ? themeAntd.darkAlgorithm
            : themeAntd.defaultAlgorithm,
      }}
    >
      <AntApp>
        <RenderRouter />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
