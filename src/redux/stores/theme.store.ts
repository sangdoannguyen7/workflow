import { IAction } from "../../interface/action.interface";

// Enhanced theme state with more configuration options
interface ThemeState {
  type: "light" | "dark";
  primaryColor: string;
  borderRadius: number;
  compactMode: boolean;
}

const initialState: ThemeState = {
  type: "light",
  primaryColor: "#1890ff",
  borderRadius: 8,
  compactMode: false,
};

const themeStore = (state = initialState, action: IAction): ThemeState => {
  switch (action.type) {
    case "dark":
      return {
        ...state,
        type: "dark",
      };
    case "light":
      return {
        ...state,
        type: "light",
      };
    case "SET_PRIMARY_COLOR":
      return {
        ...state,
        primaryColor: action.payload,
      };
    case "SET_BORDER_RADIUS":
      return {
        ...state,
        borderRadius: action.payload,
      };
    case "TOGGLE_COMPACT_MODE":
      return {
        ...state,
        compactMode: !state.compactMode,
      };
    default:
      return state;
  }
};

export default themeStore;
