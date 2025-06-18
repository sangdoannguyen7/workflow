export interface IAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface IThemeState {
  type: "light" | "dark";
  primaryColor?: string;
  borderRadius?: number;
  compactMode?: boolean;
}

export interface IState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTheme: IThemeState;
  getCollapsed: IAction;
  getReload: IAction;
}
