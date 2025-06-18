import collapseStore from "./collapsed.store";
import themeStore from "./theme.store";
import reloadStore from "./reload.store.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store: any = {
  "getTheme": themeStore,
  "getCollapsed": collapseStore,
  "getReload": reloadStore,
};

export default store;