import { EStatus } from "@/enums/share.enum";

export interface IInstructor {
  id: number;
  name: string;
  email: string;
  password: string;
  code: string;
  hours: number;
  schedule: string[][];
  status: EStatus;
  university_id: number;
}

export interface IRawData {
  instructors: {
    [key: number]: [string, number, string[][]]; //[name,hours, schedule]
  };
  rooms: {
    [key: number]: [string, string, string[][]]; //[name, type, schedule]
  };
  subjects: {
    [key: number]: [string, number, string, string, number[], number, string]; //[name, hours, code, description, instructor_ids, divisible(0 for false and 1 for true), type]
  };
  sections: {
    [key: number]: [string, string[][], number[], number]; //[name, schedule, subject_ids, divisible(0 for false and 1 for true)]
  };
}
