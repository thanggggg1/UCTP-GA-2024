"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ETypeTable } from "@/enums/table.enum";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/store/APIs/user";
import useListSemesters from "@/views/semesters/list/useListSemesters";
import { TimetableView } from "@/views/timetable";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function TimetableManagement() {
  const { semesters } = useListSemesters();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const options = useMemo(() => {
    if (!semesters) return [];
    return semesters?.map((semester) => ({
      value: semester.id.toString(),
      label: semester.name,
    }));
  }, [semesters]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4">
      <div className="flex flex-col gap-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                  <Link href="#">Manage</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Timetable</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue={ETypeTable.GRID_TIMETABLE}>
            <div className="flex items-center w-full justify-between">
              <TabsList>
                <TabsTrigger value={ETypeTable.GRID_TIMETABLE}>
                  Grid View
                </TabsTrigger>
                <TabsTrigger value={ETypeTable.INSTRUCTOR_TIMETABLE}>
                  Instructor View
                </TabsTrigger>
              </TabsList>
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
                      : "Select semester..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search semester..."
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
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {option.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                value === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
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
            <TabsContent value={ETypeTable.GRID_TIMETABLE}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Grid View</CardTitle>

                  <CardDescription>
                    View the timetable in grid view with resources and events
                    timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TimetableView
                    type={ETypeTable.GRID_TIMETABLE}
                    semester_id={value}
                    university_id={currentUser?.UniversityID.toString() || ""}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value={ETypeTable.INSTRUCTOR_TIMETABLE}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Instructor View</CardTitle>
                  <CardDescription>
                    View the timetable in timeline view instructor wise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TimetableView
                    type={ETypeTable.INSTRUCTOR_TIMETABLE}
                    semester_id={value}
                    university_id={currentUser?.UniversityID.toString() || ""}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
