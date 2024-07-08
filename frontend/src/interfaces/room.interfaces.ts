import { ERoomType, EStatus } from "@/enums/share.enum";

export interface IRoom {
  id: number;
  name: string;
  code: string;
  type: ERoomType;
  schedule: string[][];
  status: EStatus;
  university_id: number;
  // size: number;
}
