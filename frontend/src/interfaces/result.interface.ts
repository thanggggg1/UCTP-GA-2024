export interface IResult {
  id: number;
  content: string;
  timestamp: string;
  university_id: number;
  semester_id: number;
  top_chromosomes: ICourseDetail;
}
export interface ICourseDetail {
  [key: string]: {
    Details: {
      [key: string]: {
        Days: number[];
        Length: number;
        RoomID: number;
        StartSlot: number;
        InstructorID: number;
        InstructorName: string;
        CourseName: string;
      };
    };
    Schedule: string[][];
  };
}
