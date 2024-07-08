import { Separator } from "@/components/ui/separator";
import { ScheduleForm } from "./schedule-setting";

export default function SettingsProfileView() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Genetic Algorithm Config</h3>
        <p className="text-sm text-muted-foreground">
          This is how the genetic algorithm will be configured to generate the
          schedule.
        </p>
      </div>
      <Separator />
      <ScheduleForm />
    </div>
  );
}
