import { atom } from "recoil";

export type ModeType = "SLAM" | "Navigation" | "Control";

export const activeModeAtom = atom<ModeType>({
  key: "activeModeAtom",
  default: "Control",
});
