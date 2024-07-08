import { daysOfWeek, timeSlots } from "@/config/setting.config";
import { memo, useCallback, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

export const ScheduleTable = memo(function ScheduleTable({
  initialSchedule,
  saveSchedule,
}: {
  initialSchedule: string[][];
  saveSchedule: (schedule: string[][]) => void;
}) {
  const [schedule, setSchedule] = useState<string[][]>(initialSchedule);
  const toggleStatus = useCallback(
    (dayIndex: number, timeslotIndex: number) => {
      setSchedule((prevSchedule) => {
        const newSchedule = prevSchedule.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            rowIndex === timeslotIndex && cellIndex === dayIndex
              ? cell === "Available"
                ? "Unavailable"
                : "Available"
              : cell
          )
        );
        saveSchedule(newSchedule);
        return newSchedule;
      });
    },
    [setSchedule, saveSchedule]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Time Slot</TableCell>
          {daysOfWeek.map((day, dayIndex) => (
            <TableCell key={dayIndex}>{day}</TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeSlots.map((timeslot, timeslotIndex) => (
          <TableRow key={timeslotIndex}>
            <TableCell>{timeslot}</TableCell>
            {daysOfWeek.map((day, dayIndex) => (
              <TableCell
                key={`${dayIndex}-${timeslotIndex}`}
                onClick={() => toggleStatus(dayIndex, timeslotIndex)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    schedule[timeslotIndex][dayIndex] === "Available"
                      ? "green"
                      : "red",
                  color: "white",
                  border: "1px solid #ccc",
                }}
              >
                {schedule[timeslotIndex][dayIndex]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
