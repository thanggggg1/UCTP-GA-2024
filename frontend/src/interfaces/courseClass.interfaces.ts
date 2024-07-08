import { ICourse } from "./course.interfaces";
import { IInstructor } from "./instructor.interfaces";
import { IStudentsGroup } from "./student.interfaces";

export interface ICourseClass {
  id: number;
  course_id: number;
  professor_id: number;
  course: ICourse;
  professor: IInstructor;
  students_groups: string[];
  requiredSeats: number;
  lab: boolean;
  duration: number; // Duration in hours
}

export interface IAddCourseClass {
  course_id: number;
  professor_id: number;
  requiredSeats: number;
  lab: boolean;
  duration: number;
}
