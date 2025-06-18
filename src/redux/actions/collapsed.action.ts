import { IAction } from "../../interface/action.interface";

export function useCollapsedSmall(): IAction {
  const smallMode: IAction = {
    type: "small",
    payload: ""
  }
  return smallMode;
}

export function useCollapsedLarge(): IAction {
  const largeMode: IAction = {
    type: "large",
    payload: ""
  }
  return largeMode;
}