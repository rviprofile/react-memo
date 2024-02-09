import { configureStore } from "@reduxjs/toolkit";
import easyModeReducer from "./reducers/easyModeReducer";

export const store = configureStore({
  reducer: {
    easyMode: easyModeReducer,
  },
});
