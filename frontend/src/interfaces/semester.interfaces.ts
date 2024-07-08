import { EStatus } from "@/enums/share.enum";
import { ICourse } from "./course.interfaces";

export interface ISemester {
  id: number;
  name: string;
  schedule: string[][];
  course_ids: number[];
  courses?: ICourse[];
  status: EStatus;
  stay: boolean;
  university_id: number;
  university?: IUniversity;
}
