import { ISemester } from "@/interfaces/semester.interfaces";
import { defaultSchedule } from "./setting.config";
import { EStatus } from "@/enums/share.enum";

export const defaultSemesterConfig: ISemester = {
  id: 0,
  university_id: 0,
  name: "",
  schedule: defaultSchedule,
  course_ids: [],
  courses: [],
  status: EStatus.ACTIVE,
  stay: false,
};
