import { EStatus } from "@/enums/share.enum";
import { IInstructor } from "@/interfaces/instructor.interfaces";
import { defaultSchedule } from "./setting.config";

export const defaultInstructorConfig: IInstructor = {
  id: 0,
  university_id: 0,
  email: "",
  password: "",
  name: "",
  code: "",
  hours: 30,
  schedule: defaultSchedule,
  status: EStatus.ACTIVE,
};
