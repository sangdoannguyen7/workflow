export interface IAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface IState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTheme: IAction;
  getCollapsed: IAction;
  getReload: IAction;
}