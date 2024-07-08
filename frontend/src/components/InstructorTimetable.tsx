import { memo, useCallback, useMemo, useState } from "react";
import { IRoom } from "@/interfaces/room.interfaces";
import { ICourseDetail } from "@/interfaces/result.interface";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  convertToEvents,
  convertToEventsBasecInstructorID,
} from "@/utils/time";
import listPlugin from "@fullcalendar/list";
import useListInstructors from "@/views/instructors/list/useListInstructors";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

export const InstructorTimetable = memo(function InstructorTimetable({
  detail,
  rooms,
  timeslots,
}: {
  detail: ICourseDetail;
  rooms: IRoom[];
  timeslots: string[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { filter, setFilter, instructors } = useListInstructors();

  const events = useMemo(() => {
    return convertToEventsBasecInstructorID(detail, timeslots, value);
  }, [detail, value]);

  const options = useMemo(() => {
    if (!instructors) return [];
    return instructors?.map((instructor) => ({
      value: instructor.id.toString(),
      label: instructor.name,
    }));
  }, [instructors]);

  const onSearch = useCallback(
    debounce(
      (value: string) =>
        setFilter({
          ...filter,
          name: value,
        }),
      300
    ),
    []
  );

  const formattedTimeslots = useMemo(() => {
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:00`;
    };
    const [minTime] = timeslots[0].split("-");
    const [, maxTime] = timeslots[timeslots.length - 1].split("-");

    const formattedMinTime = formatTime(minTime);
    const formattedMaxTime = formatTime(maxTime);

    return {
      minTime: formattedMinTime,
      maxTime: formattedMaxTime,
    };
  }, []);

  return (
    <div className="calendar-container h-max">
      <div className="flex w-full justify-end mb-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[240px] justify-between"
            >
              {value
                ? options.find((option) => option.value === value)?.label
                : "Select instructor..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0">
            <Command>
              <CommandInput
                onValueChange={onSearch}
                placeholder="Search instrucotr..."
                className="h-9"
              />
              <CommandEmpty>No semester found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay,listWeek",
        }}
        allDayText="Full day"
        eventMinWidth={200}
        slotMinTime={formattedTimeslots.minTime}
        slotMaxTime={formattedTimeslots.maxTime}
        events={events}
        stickyFooterScrollbar
        stickyHeaderDates
        titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
        nowIndicator
        themeSystem="sandstone"
        // editable={true}
        selectable={true}
        selectMirror={true}
        weekends={false}
      />
    </div>
  );
});
