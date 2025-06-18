import { IAction } from "../../interface/action.interface";

export function useReload(currentType: boolean): IAction {
    return  {
        type: currentType,
        payload: ""
    } as IAction;
}