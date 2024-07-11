import { ERoomType } from "@/enums/share.enum";
import { IInstructor } from "./instructor.interfaces";

export interface ICourse {
  id: number;
  code: string;
  code_hp: string;
  name: string;
  hours: number;
  description: string;
  divisible: boolean;
  type: ERoomType;
  instructor_ids: number[];
  num_of_registrations: number;
  instructors?: IInstructor[];
  university_id: number;
}
