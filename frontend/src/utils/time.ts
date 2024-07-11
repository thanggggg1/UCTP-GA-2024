import { ICourseDetail } from "@/interfaces/result.interface";

export function convertToEvents(
  topChromosomes: ICourseDetail,
  timeslots: string[]
) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const currentDate = new Date();
  const startOfWeek = currentDate.getDate() - currentDate.getDay() + 1; // Get the start of the week (Monday)

  const events: any = [];

  Object.entries(topChromosomes).forEach(([courseId, courseDetail]) => {
    Object.entries(courseDetail.Details).forEach(([detailId, detail]) => {
      if (detail.Days === null) return;
      const dayName = daysOfWeek[detail.Days[0] - 1];
      const dayOffset = detail.Days[0] - 1; // Days are 1-based
      const startDate = new Date(currentDate.setDate(startOfWeek + dayOffset));

      // Get start and end times from timeslots
      const startTimeslot = timeslots[detail.StartSlot];
      const startTimeslotParts = startTimeslot.split("-");
      const startTime = startTimeslotParts[0];

      const endTimeslotIndex = detail.StartSlot + detail.Length - 1;
      const endTimeslot = timeslots[endTimeslotIndex];
      const endTimeslotParts = endTimeslot.split("-");
      const endTime = endTimeslotParts[1];

      // Combine start date with start time
      const startDateTime = new Date(startDate);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      // Combine start date with end time
      const endDateTime = new Date(startDate);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      events.push({
        title: `${detail.CourseName}`,
        instructor: detail.InstructorName,
        start: startDateTime,
        end: endDateTime,
        resourceId: detail.RoomID,
        backgroundColor: pickRandomColor(),
      });
    });
  });

  return events;
}
export function convertToEventsBasecInstructorID(
  topChromosomes: ICourseDetail,
  timeslots: string[],
  instructorID: string
) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const currentDate = new Date();
  const startOfWeek = currentDate.getDate() - currentDate.getDay() + 1; // Get the start of the week (Monday)

  const events: any = [];

  Object.entries(topChromosomes).forEach(([courseId, courseDetail]) => {
    Object.entries(courseDetail.Details).forEach(([detailId, detail]) => {
      if (detail.Days === null) return;

      if (detail.InstructorID.toString() === instructorID) {
        const dayName = daysOfWeek[detail.Days[0] - 1];
        const dayOffset = detail.Days[0] - 1; // Days are 1-based
        const startDate = new Date(
          currentDate.setDate(startOfWeek + dayOffset)
        );

        // Get start and end times from timeslots
        const startTimeslot = timeslots[detail.StartSlot];
        const startTimeslotParts = startTimeslot.split("-");
        const startTime = startTimeslotParts[0];

        const endTimeslotIndex = detail.StartSlot + detail.Length - 1;
        const endTimeslot = timeslots[endTimeslotIndex];
        const endTimeslotParts = endTimeslot.split("-");
        const endTime = endTimeslotParts[1];

        // Combine start date with start time
        const startDateTime = new Date(startDate);
        const [startHour, startMinute] = startTime.split(":").map(Number);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        // Combine start date with end time
        const endDateTime = new Date(startDate);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        events.push({
          title: `${detail.CourseName}`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: pickRandomColor(),
        });
      }
    });
  });

  return events;
}

const colors = [
  "#4CA37E", // Dodger Blue
  "#255DB3", // Orange Red
  "#E99E3A", // Lime Green
];

function pickRandomColor(excludeColor: string = "#FFFFFF"): string {
  let randomColor = excludeColor;
  while (randomColor === excludeColor) {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
  }
  return randomColor;
}

interface InstructorCourseCount {
  id: number;
  name: string;
  count: number;
}

interface TimeSlotCount {
  day: number;
  time: string;
  count: number;
}

export function analyzeResult(courses: ICourseDetail, timeslots: string[]) {
  const instructorCourseMap: { [key: string]: { id: number; count: number } } =
    {};
  const timeSlotCountMap: { [key: string]: number } = {};

  for (const courseKey in courses) {
    const courseDetails = courses[courseKey].Details;

    for (const detailKey in courseDetails) {
      const detail = courseDetails[detailKey];

      // Count courses handled by each instructor
      const instructorName = detail.InstructorName;
      const instructorId = detail.InstructorID;
      if (!instructorCourseMap[instructorName]) {
        instructorCourseMap[instructorName] = { id: instructorId, count: 0 };
      }
      instructorCourseMap[instructorName].count++;

      // Count each timeslot for peak slot time
      detail.Days?.forEach((day) => {
        for (let i = 0; i < detail.Length; i++) {
          const startSlotIndex = detail.StartSlot + i;
          const timeslot = `${day}-${timeslots[startSlotIndex]}`;

          if (!timeSlotCountMap[timeslot]) {
            timeSlotCountMap[timeslot] = 0;
          }
          timeSlotCountMap[timeslot]++;
        }
      });
    }
  }

  // Convert instructorCourseMap to array
  const instructorCourseCount: InstructorCourseCount[] = Object.keys(
    instructorCourseMap
  ).map((name) => ({
    id: instructorCourseMap[name].id,
    name,
    count: instructorCourseMap[name].count,
  }));

  // Find the peak slot time
  const peakSlotTimes: TimeSlotCount[] = Object.keys(timeSlotCountMap).map(
    (timeslot) => {
      const [day, time] = timeslot.split("-");
      return {
        day: parseInt(day),
        time,
        count: timeSlotCountMap[timeslot],
      };
    }
  );

  // Find the busiest time slots
  peakSlotTimes.sort((a, b) => b.count - a.count);

  return { instructorCourseCount, peakSlotTimes };
}

export function convertDaytoText(day: number) {
  switch (day) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    default:
      return "";
  }
}
