import { ICourseClass } from "./courseClass.interfaces";

export interface IStudentsGroup {
  id: number;
  name: string;
  size: number;
  course_classes: ICourseClass[];
}
export interface IAddStudentsGroup {
  name: string;
  size: number;
}
