import { GridTimetable } from "@/components/GridTimetable";
import { InstructorTimetable } from "@/components/InstructorTimetable";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ETypeTable } from "@/enums/table.enum";
import { useGetResultQuery } from "@/store/APIs/result";
import { useGetRoomsQuery } from "@/store/APIs/rooms";
import { useGetSettingByIdQuery } from "@/store/APIs/settings";
import { memo } from "react";

export const TimetableView = memo(function TimetableView({
  university_id,
  semester_id,
  type,
}: {
  university_id: string;
  semester_id: string;
  type: ETypeTable;
}) {
  const { data: result, isLoading: isLoadingResult } = useGetResultQuery({
    university_id,
    semester_id,
  });

  const { data: rooms, isLoading: isLoadingRooms } = useGetRoomsQuery({
    university_id,
  });
  const { data: setting, isLoading: isLoadingSetting } = useGetSettingByIdQuery(
    {
      university_id,
    }
  );
  if (!university_id || !semester_id)
    return (
      <Label htmlFor="terms">
        Please select semester to view the timetable.
      </Label>
    );

  if (
    isLoadingResult ||
    isLoadingRooms ||
    isLoadingSetting ||
    !setting ||
    !rooms ||
    !result
  )
    return <Skeleton />;
  return type === ETypeTable.GRID_TIMETABLE ? (
    <GridTimetable
      detail={result?.top_chromosomes}
      rooms={rooms}
      timeslots={setting?.timeslots}
    />
  ) : (
    <InstructorTimetable
      detail={result?.top_chromosomes}
      rooms={rooms}
      timeslots={setting?.timeslots}
    />
  );
});
