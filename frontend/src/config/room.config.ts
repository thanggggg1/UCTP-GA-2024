import { ERoomType, EStatus } from "@/enums/share.enum";
import { defaultSchedule } from "./setting.config";
import { IRoom } from "@/interfaces/room.interfaces";

export const defaultRoomConfig: IRoom = {
  id: 0,
  university_id: 0,
  name: "",
  code: "",
  type: ERoomType.LEC,
  schedule: defaultSchedule,
  status: EStatus.ACTIVE,
  size: 0,
};
