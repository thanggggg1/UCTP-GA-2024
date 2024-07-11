"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMetricsQuery } from "@/store/APIs/metrics";
import { useGetCurrentUserQuery } from "@/store/APIs/user";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Computer,
  CreditCard,
  DollarSign,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import useListSemesters from "../semesters/list/useListSemesters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetResultQuery } from "@/store/APIs/result";
import { useGetSettingByIdQuery } from "@/store/APIs/settings";
import { analyzeResult, convertDaytoText } from "@/utils/time";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";
import { CustomChart } from "./CustomChart";

export const DashboardView = memo(function DashboardView() {
  const { data: currentUser } = useGetCurrentUserQuery();

  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const { semesters } = useListSemesters();

  const { data: setting } = useGetSettingByIdQuery({
    university_id: currentUser?.UniversityID.toString() || "",
  });

  const { data: metrics, isLoading } = useGetMetricsQuery({
    university_id: Number(currentUser?.UniversityID) || 0,
  });

  const { data: result } = useGetResultQuery({
    university_id: currentUser?.UniversityID || "",
    semester_id: selectedSemester,
  });

  const dataTable = useMemo(() => {
    if (!setting || !result) return null;
    return analyzeResult(result.top_chromosomes, setting.timeslots);
  }, [result, setting]);

  useEffect(() => {
    if (semesters && semesters.length > 0) {
      setSelectedSemester(semesters[0]?.id.toString());
    }
  }, [semesters]);

  if (isLoading) return <Skeleton />;
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4">
      <div className="flex flex-col gap-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                  <Link href="#">University</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total schedules
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.total_schedules}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0 since last hour
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Instructors
                </CardTitle>
                <UserRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.total_instructors}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rooms
                </CardTitle>
                <Computer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_rooms}</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.total_courses}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-2">
                  <CardTitle>Instructor Activity Ranking</CardTitle>
                  <CardDescription>
                    Show the number of courses each instructor is handling.{" "}
                  </CardDescription>
                </div>
                <div className="min-w-24">
                  <Select
                    value={selectedSemester}
                    onValueChange={(value) => {
                      setSelectedSemester(value);
                    }}
                  >
                    <SelectTrigger id="type" aria-label="Select semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters?.map((semester) => (
                        <SelectItem
                          key={semester.id}
                          value={semester.id.toString()}
                        >
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instructors</TableHead>
                      <TableHead className="text-right">
                        Number of courses teaching
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataTable &&
                      dataTable.instructorCourseCount
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((instructor) => (
                          <TableRow key={instructor.id}>
                            <TableCell>
                              <div className="font-medium">
                                {instructor.name}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                ID: {instructor.id}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {instructor.count}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Recent Peak Hours</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                {dataTable &&
                  dataTable.peakSlotTimes
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 7)
                    .map((time) => (
                      <div key={time.time} className="flex items-center gap-4">
                        <CalendarClock />
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">
                            {convertDaytoText(time.day)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {time.time}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {time.count} booked
                        </div>
                      </div>
                    ))}
              </CardContent>
            </Card>
          </div>
          <CustomChart />
        </main>
      </div>
    </div>
  );
});
