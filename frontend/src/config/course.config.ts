import { ERoomType } from "@/enums/share.enum";
import { ICourse } from "@/interfaces/course.interfaces";

export const defaultCourseConfig: ICourse = {
  id: 0,
  university_id: 0,
  instructor_ids: [],
  name: "",
  code: "",
  code_hp: "",
  description: "",
  hours: 0,
  num_of_registrations: 0,
  divisible: false,
  type: ERoomType.LEC,
};
