import { IAction } from "../../interface/action.interface";

const initialState = 'small'

const collapseStore = (state = initialState, action: IAction): IAction => {
  switch (action.type) {
    case 'small':
      return {type: 'small', payload: ''};
    case 'large':
      return {type: 'large', payload: ''};
    default:
      return {type: state, payload: ''};
  }
}

export default collapseStore;