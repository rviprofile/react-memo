import { EASY_MODE_ON, EASY_MODE_OFF } from "../types/types";

export const easyModeOnCreator = () => ({
  type: EASY_MODE_ON,
});

export const easyModeOffCreator = () => ({
  type: EASY_MODE_OFF,
});
