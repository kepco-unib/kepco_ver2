import { atom } from "recoil";

export interface MapData {
  map_name: string;
  map_num: number;
  map_type: string;
  map_date: string;
  map_size: string;
  note: string;
}

export const selectedMapState = atom<MapData | null>({
  key: "selectedMapState",
  default: null,
});
