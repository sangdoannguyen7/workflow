import { IAction } from "../../interface/action.interface";

const initialState = false

const reloadStore = (state = initialState, action: IAction): IAction => {
  switch (action.type) {
    case false:
      return {type: true, payload: ''};
    case true:
      return {type: false, payload: ''};
    default:
      return {type: state, payload: ''};
  }
}

export default reloadStore;