import { IAction } from "../../interface/action.interface";

export function useDarkMode(): IAction {
  const darkMode: IAction = {
    type: "dark",
    payload: ""
  }
  return darkMode;
}

export function useLightMode(): IAction {
  const lightMode: IAction = {
    type: "light",
    payload: ""
  }
  return lightMode;
}