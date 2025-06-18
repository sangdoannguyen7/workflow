import { IAction } from "../../interface/action.interface";

const initialState = 'light'

const themeStore = (state = initialState, action: IAction): IAction => {
  switch (action.type) {
    case 'dark':
      return {type: 'dark', payload: ''};
    case 'light':
      return {type: 'light', payload: ''};
    default:
      return {type: state, payload: ''};
  }
}

export default themeStore;