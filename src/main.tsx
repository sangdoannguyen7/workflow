import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// import { persistStore } from 'redux-persist';
// import { PersistGate } from 'redux-persist/integration/react';
import store from "./redux/stores/store.ts";
import { configureStore } from "@reduxjs/toolkit";
import App from "./app.tsx";
import "./styles/global.css";
// import dayjs from 'dayjs'
// import weekday from "dayjs/plugin/weekday"
// import localeData from "dayjs/plugin/localeData"
// import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
// import 'dayjs/locale/zh-cn' // import locale
//
// dayjs.extend(weekday)
// dayjs.extend(localeData)
//
// dayjs.extend(isLeapYear) // use plugin
// dayjs.locale('zh-cn') // use locale
const stores = configureStore({ reducer: store });

// eslint-disable-next-line react-refresh/only-export-components
function AppWithCallbackAfterRender() {
  // const persistor = persistStore(stores);

  return (
    <Provider store={stores}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<AppWithCallbackAfterRender />);
