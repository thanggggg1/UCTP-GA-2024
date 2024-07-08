"use client";
// FullCalendarComponent.jsx
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
export const CustomTimeTable = () => {
  return (
    <div className="calendar-container">
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
          right:
            "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
        }}
        titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
        initialView="resourceTimelineDay"
        nowIndicator={true}
        // editable={true}
        selectable={true}
        selectMirror={true}
        resourceAreaWidth={"%"}
        slotMinTime={"09:00:00"}
        slotMaxTime={"18:00:00"}
        weekends={false}
        resourceGroupField="building"
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
        resources={[
          {
            id: "a",
            building: "D9",
            title: "501",
            occupancy: 40,
          },
          {
            id: "b",
            building: "D9",
            title: "502",
            occupancy: 40,
          },
          {
            id: "c",
            building: "D9",
            title: "503",
            occupancy: 40,
          },
        ]}
        initialEvents={[
          { title: "Start programming", start: new Date(), resourceId: "a" },
        ]}
      />
    </div>
  );
};
