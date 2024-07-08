"use client";
import { memo, useEffect, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import { useUpsertScheduleMutation } from "@/store/APIs/schedule";
export const ScheduleProcessView = memo(function ScheduleProcessView() {
  const [upsert, { data, isError, isSuccess, error }] =
    useUpsertScheduleMutation();

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8081/events?stream=messages"
    );

    eventSource.onmessage = (event) => {
      console.log("New message:", event.data);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4">
      <div className="flex flex-col">
        <header className="flex flex-col gap-1 border-b p-4">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Schedule</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Schedule Process</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Process Management</h1>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-5 bg-background">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Generations #7 from 58 offspring
                </legend>
                <div className="grid gap-3">
                  <div className="grid gap-3">
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Current rate
                        </span>
                        <span>450%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Average Fitness of previous
                        </span>
                        <span>0.00%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Lowest fitness
                        </span>
                        <span>0.00%</span>
                      </li>
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Population
                        </span>
                        <span>61</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Fitness average
                        </span>
                        <span>53.01%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Elantric fitness
                        </span>
                        <span>60.16%</span>
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
                        <span>00:42:54</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Memory</span>
                        <span>126.48MB</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Top results
                </legend>
                <div className="grid gap-3">
                  <span className="text-muted-foreground">
                    Top 5 best chromosomes from last generation
                  </span>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-4">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div className="flex-1">
              <ul>
                {messages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
            <form
              className="relative border-none overflow-hidden rounded-lg border focus-within:ring-1 focus-within:ring-ring flex gap-4 justify-end"
              x-chunk="dashboard-03-chunk-1"
            >
              <Button type="submit" size="sm" className="gap-1.5">
                Stop Execution
                <CornerDownLeft className="size-3.5" />
              </Button>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  upsert({ university_id: 1, semester_id: 1 });
                }}
              >
                Continue Execution
                <CornerDownLeft className="size-3.5" />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
});
