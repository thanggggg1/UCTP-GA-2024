"use client";
import { memo, useEffect, useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  useClearEventStreamQuery,
  useUpsertScheduleMutation,
} from "@/store/APIs/schedule";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Label } from "@radix-ui/react-label";
import {
  ICourseDetail,
  IRealTimeChromosome,
  IRealTimeData,
} from "@/interfaces/result.interface";
import useListRooms from "@/views/rooms/list/useListRooms";
import { CustomTimeTable } from "@/components/CustomTimetable";
import { GridTimetable } from "@/components/GridTimetable";
import { useGetSettingByIdQuery } from "@/store/APIs/settings";
import { useGetCurrentUserQuery } from "@/store/APIs/user";

export const ScheduleProcessView = memo(function ScheduleProcessView() {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const timerRef = useRef<number | null>(null); // Reference to store the timer interval
  const startTimeRef = useRef<Date | null>(null); // Reference to store the start time
  const [statusMessage, setStatusMessage] =
    useState<string>("First generation");
  const [detailsMessage, setDetailsMessage] = useState<number[]>([]);
  const [operation, setOperation] = useState<number>(0);
  const [progressBar, setProgressBar] = useState<number>(0);
  const [progressMessages, setProgressMessages] = useState<string>("");

  const [currentChromosome, setCurrentChromosome] =
    useState<IRealTimeData | null>(null);

  const { isLoading: loadingClear } = useClearEventStreamQuery();

  const { rooms } = useListRooms();
  const { data: currentUser } = useGetCurrentUserQuery();

  const { data: setting, isLoading: isLoadingSetting } = useGetSettingByIdQuery(
    {
      university_id: currentUser?.UniversityID.toString() || "",
    }
  );

  const [upsert, { data, isError, isSuccess, error }] =
    useUpsertScheduleMutation();

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear any existing interval
    }
    startTimeRef.current = new Date();
    timerRef.current = window.setInterval(() => {
      const currentTime = new Date();
      if (startTimeRef.current) {
        const diff = currentTime.getTime() - startTimeRef.current.getTime();
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(
          2,
          "0"
        );
        const minutes = String(
          Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0");
        const seconds = String(
          Math.floor((diff % (1000 * 60)) / 1000)
        ).padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clear the interval on component unmount
      }
    };
  }, []);
  console.log("currentChromosome", currentChromosome);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.HOST}/events?stream=messages`
    );

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      const { type, data } = parsedData;

      switch (type) {
        case "status":
          setStatusMessage(data);
          break;
        case "details":
          setDetailsMessage(data);
          break;
        case "operation":
          setOperation(data);
          break;
        case "data": {
          if (data && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            //get best chromosome
            setCurrentChromosome(data[randomIndex]);
          }
          break;
        }
        case "progressBar":
          setProgressBar(data);
          break;
        case "progress":
          setProgressMessages(data);
          break;
        default:

        // console.warn(`Unhandled signal type: ${type}`);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);
  console.log("currentChromosome", currentChromosome);

  if (loadingClear) return <Skeleton />;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col items-end">
        <header className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-4 justify-start ">
            <h1 className="text-xl font-semibold text-start">
              Process Management
            </h1>
          </div>
        </header>
        <main className="grid flex-1 gap-4 p-2 min-h-[80vh] overflow-auto md:grid-cols-2 lg:grid-cols-5 bg-background">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium h-3 mb-5">
                  {statusMessage}
                </legend>
                <div className="grid gap-3">
                  <div className="grid gap-3">
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Current rate
                        </span>
                        <span>{detailsMessage[2] || "-"}%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Average Fitness of previous
                        </span>
                        <span>{Math.round(detailsMessage[4] || 0)}%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Lowest fitness
                        </span>
                        <span>{Math.round(detailsMessage[6] || 0)}%</span>
                      </li>
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Population
                        </span>
                        <span>{detailsMessage[1] || 20}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Fitness average
                        </span>
                        <span>{Math.round(detailsMessage[3] || 0)}%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Elantric fitness
                        </span>
                        <span>{detailsMessage[5] || 0}%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  System Status
                </legend>
                <div className="grid gap-3">
                  <div className="grid gap-3">
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Elapsed time
                        </span>
                        <span>{elapsedTime}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Memory</span>
                        <span>126.48MB</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </fieldset>
              {/* <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Top results
                </legend>
                <div className="grid gap-3">
                  <span className="text-muted-foreground">
                    Top 5 best chromosomes from last generation
                  </span>
                </div>
              </fieldset> */}
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-4">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div className="flex-1">
              {rooms &&
              currentChromosome?.Data.Semesters &&
              setting?.timeslots ? (
                <GridTimetable
                  detail={currentChromosome?.Data?.Semesters}
                  rooms={rooms}
                  timeslots={setting?.timeslots}
                />
              ) : (
                <CustomTimeTable />
              )}
            </div>
            {/* <form */}
            {/* className="relative border-none overflow-hidden rounded-lg border focus-within:ring-1 focus-within:ring-ring flex gap-4 justify-end" */}
            {/* x-chunk="dashboard-03-chunk-1" */}
            {/* > */}
            {/* <Button type="submit" size="sm" className="gap-1.5">
                Stop Execution
                <CornerDownLeft className="size-3.5" />
              </Button> */}

            {/* </form> */}
            <Label>{`The level: ${progressMessages}`}</Label>
            <Progress value={progressBar} className="w-[100%]" />
          </div>
        </main>
        <Button
          type="submit"
          size="sm"
          className="gap-1.5 w-40"
          onClick={() => {
            startTimer();
            upsert({ university_id: 1, semester_id: 1 });
          }}
        >
          Start Execution
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </div>
  );
});
