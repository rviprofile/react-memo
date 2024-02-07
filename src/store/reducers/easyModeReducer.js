import { EASY_MODE_ON, EASY_MODE_OFF } from "./../actions/types/types.js";

const initialState = { status: false };

export default function easyModeReducer(state = initialState, action) {
  switch (action.type) {
    case EASY_MODE_ON: {
      return { ...state, status: true };
    }
    case EASY_MODE_OFF: {
      return { ...state, status: false };
    }
    default:
      return state;
  }
}
