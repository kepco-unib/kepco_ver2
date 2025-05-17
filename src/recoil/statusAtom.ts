import { atom } from "recoil";

export interface StatusData {
  velocity: string;
  angular_velocity: string;
  battery: string;
  temperature: string;
  roll: string;
  pitch: string;
  yaw: string;
}

export const statusAtom = atom<StatusData>({
  key: "statusAtom",
  default: {
    velocity: "0.0",
    angular_velocity: "0.0",
    battery: "100",
    temperature: "25.0",
    roll: "0.0",
    pitch: "0.0",
    yaw: "0.0",
  },
});

export type StatusType = "start" | "pause" | "end";

export const slamStatusAtom = atom<StatusType>({
  key: "slamStatusAtom",
  default: "end", // 초기 상태는 'end'
});

export const navStatusAtom = atom<StatusType>({
  key: "navStatusAtom",
  default: "end",
});