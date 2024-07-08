// Assuming the interfaces are already defined somewhere in your codebase, like this:
// interface Course { ... }
// interface Professor { ... }
// interface StudentsGroup { ... }
// interface Room { ... }
// interface CourseClass { ... }

import { ICourse, ICourseClass } from "@/interfaces/course.interfaces";
import { IInstructor } from "@/interfaces/professor.interfaces";
import { IRoom } from "@/interfaces/room.interfaces";
import { IStudentsGroup } from "@/interfaces/student.interfaces";

// Dummy data
export const courses: ICourse[] = [
  { id: "course1", name: "Computer Science" },
  { id: "course2", name: "Mathematics" },
  { id: "course3", name: "Physics" },
  { id: "course4", name: "Chemistry" },
];

export const professors: IInstructor[] = [
  { id: "prof1", name: "Dr. Smith", classes: [] },
  { id: "prof2", name: "Dr. Johnson", classes: [] },
  { id: "prof3", name: "Dr. Williams", classes: [] },
  { id: "prof4", name: "Dr. Brown", classes: [] },
];

export const studentGroups: IStudentsGroup[] = [
  { id: "group1", name: "Group A", size: 30, classes: [] },
  { id: "group2", name: "Group B", size: 25, classes: [] },
  { id: "group3", name: "Group C", size: 20, classes: [] },
  { id: "group4", name: "Group D", size: 35, classes: [] },
];

export const rooms: IRoom[] = [
  { id: "room1", name: "Room 101", seats: 30, hasComputers: true },
  { id: "room2", name: "Room 102", seats: 40, hasComputers: false },
  { id: "room3", name: "Room 103", seats: 25, hasComputers: true },
  { id: "room4", name: "Room 104", seats: 35, hasComputers: false },
];

export const courseClasses: ICourseClass[] = [
  {
    course: courses[0],
    professor: professors[0],
    studentGroups: [studentGroups[0], studentGroups[1]],
    requiredSeats: 55,
    requiresComputers: true,
    duration: 2,
  },
  {
    course: courses[1],
    professor: professors[1],
    studentGroups: [studentGroups[0], studentGroups[2]],
    requiredSeats: 50,
    requiresComputers: false,
    duration: 1.5,
  },
  {
    course: courses[2],
    professor: professors[2],
    studentGroups: [studentGroups[1], studentGroups[3]],
    requiredSeats: 60,
    requiresComputers: true,
    duration: 3,
  },
  {
    course: courses[3],
    professor: professors[3],
    studentGroups: [studentGroups[2], studentGroups[3]],
    requiredSeats: 55,
    requiresComputers: false,
    duration: 2.5,
  },
];

// Assign classes to professors and student groups
professors[0].classes.push(courseClasses[0]);
professors[1].classes.push(courseClasses[1]);
professors[2].classes.push(courseClasses[2]);
professors[3].classes.push(courseClasses[3]);

studentGroups[0].classes.push(courseClasses[0], courseClasses[1]);
studentGroups[1].classes.push(courseClasses[0], courseClasses[2]);
studentGroups[2].classes.push(courseClasses[1], courseClasses[3]);
studentGroups[3].classes.push(courseClasses[2], courseClasses[3]);

// Log dummy data to console
console.log("Courses:", courses);
console.log("Professors:", professors);
console.log("Student Groups:", studentGroups);
console.log("Rooms:", rooms);
console.log("Classes:", courseClasses);
