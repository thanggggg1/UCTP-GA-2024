import { memo } from "react";
import { CalendarDateRangePicker } from "./date-range-picker";
import { Button } from "./ui/button";

export const TitlePage = memo(function TitlePage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
    </div>
  );
});
