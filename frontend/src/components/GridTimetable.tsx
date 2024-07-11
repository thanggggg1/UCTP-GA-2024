import { memo, useCallback, useMemo } from "react";
import { IRoom } from "@/interfaces/room.interfaces";
import { ICourseDetail } from "@/interfaces/result.interface";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { convertToEvents } from "@/utils/time";

export const GridTimetable = memo(function GridTimetable({
  detail,
  rooms,
  timeslots,
}: {
  detail: ICourseDetail;
  rooms: IRoom[];
  timeslots: string[];
}) {
  const events = useMemo(() => {
    return convertToEvents(detail, timeslots);
  }, [detail, timeslots]);
  const formatResouces = useMemo(() => {
    return rooms.map((room) => ({
      id: room.id.toString(),
      title: room.name,
      type: room.type,
      occupancy: 40,
      size: room.size,
    }));
  }, [rooms]);

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
  }, [timeslots]);

  return (
    <div className="calendar-container h-max">
      <FullCalendar
        plugins={[
          resourceTimelinePlugin,
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
        ]}
        headerToolbar={{
          // left: "prev,next today",
          left: "prev,next",
          center: "title",
          right: "resourceTimelineDay,resourceTimelineWeek",
          //   resourceTimelineMonth,
        }}
        stickyFooterScrollbar
        stickyHeaderDates
        titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
        initialView="resourceTimelineWeek"
        nowIndicator={true}
        themeSystem="bootstrap5"
        // editable={true}
        selectable={true}
        selectMirror={true}
        resourceAreaWidth={"10%"}
        slotMinTime={formattedTimeslots.minTime}
        slotMaxTime={formattedTimeslots.maxTime}
        weekends={false}
        // slotLabelFormat={{
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   hour12: false,
        // }}
        eventContent={(arg) => {
          console.log(arg);
          return (
            <div className="flex flex-col gap-1">
              <b className="font-medium">{arg.event._def.title}</b>
              <i>{arg.event._def.extendedProps.instructor}</i>
            </div>
          );
        }}
        resourceLabelContent={(arg) => {
          return (
            <div>
              <b>{arg.resource.title}</b>
              <div>
                {arg.resource._resource.extendedProps.type} -{" "}
                {arg.resource._resource.extendedProps.size}
              </div>
            </div>
          );
        }}
        // resourceGroupField="building"
        // resourceAreaColumns={[
        //   {
        //     group: true,
        //     field: "building",
        //     headerContent: "Building",
        //   },
        //   {
        //     field: "title",
        //     headerContent: "Room",
        //   },
        //   {
        //     field: "occupancy",
        //     headerContent: "Occupancy",
        //   },
        // ]}
        // resourcesInitiallyExpanded={false}
        resources={formatResouces}
        initialEvents={events}
      />
    </div>
  );
});
