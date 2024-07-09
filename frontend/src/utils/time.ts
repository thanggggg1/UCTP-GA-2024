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
        title: `${detail.CourseName} - ${detail.InstructorName}`,
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
  "#1E90FF", // Dodger Blue
  "#FF4500", // Orange Red
  "#32CD32", // Lime Green
  "#8A2BE2", // Blue Violet
  "#FF1493", // Deep Pink
  "#FF6347", // Tomato
  "#40E0D0", // Turquoise
  "#FFD700", // Gold
  "#FF69B4", // Hot Pink
  "#4169E1", // Royal Blue
  "#00FA9A", // Medium Spring Green
  "#FF8C00", // Dark Orange
  "#FF00FF", // Magenta
  "#00CED1", // Dark Turquoise
  "#7B68EE", // Medium Slate Blue
  "#DC143C", // Crimson
];

function pickRandomColor(excludeColor: string = "#FFFFFF"): string {
  let randomColor = excludeColor;
  while (randomColor === excludeColor) {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
  }
  return randomColor;
}
