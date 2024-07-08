"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useBoolean } from "@/hooks/useBoolean";
import useListInstructors from "../list/useListInstructors";
import { useGetInstructorByIdQuery } from "@/store/APIs/instructors";
import { useCallback, useEffect } from "react";
import { editInstructor, loadInstructor } from "@/store/modules/instructors";
import { defaultInstructorConfig } from "@/config/instructor.config";
import { IInstructor } from "@/interfaces/instructor.interfaces";
import { ValueOf } from "@/types/common";
import { EStatus } from "@/enums/share.enum";
import { ScheduleTable } from "@/components/ScheduleTable";
import { useGetCurrentUserQuery } from "@/store/APIs/user";

export function EditInstructorConfig({ id }: { id?: number | string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const instructorEditing = useAppSelector(
    (state) => state.instructor.instructorEditing
  );
  // const [modalVisible, show, hide, toggle] = useBoolean();
  const { onDelete, create, update } = useListInstructors();

  const { data, isLoading } = useGetInstructorByIdQuery(
    {
      id: String(id),
    },
    { skip: !id }
  );

  const { data: currentUser } = useGetCurrentUserQuery();

  const handleEdit = useCallback(
    (key: keyof IInstructor, value: ValueOf<IInstructor>) => {
      dispatch(
        editInstructor({
          path: [key],
          value,
        })
      );
    },
    [dispatch]
  );

  const onSave = useCallback(() => {
    if (id) {
      update({
        ...instructorEditing,
        id: Number(id),
        university_id: Number(currentUser?.UniversityID) || 0,
      });
    } else {
      create({
        ...instructorEditing,
        university_id: Number(currentUser?.UniversityID) || 0,
      });
      router.push("/instructors");
    }
  }, [router, create, update, id, instructorEditing, currentUser]);

  useEffect(() => {
    if (!id) {
      dispatch(loadInstructor(defaultInstructorConfig));
    } else if (data) {
      dispatch(loadInstructor(data));
    }
  }, [dispatch, data, id]);

  if (isLoading) return <Skeleton />;
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                  <Link href="#">Manage</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {id ? "Edit Instructor" : "Create Instructor"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-4/5 flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  router.push("/instructors");
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {instructorEditing.name || "Create Instructor"}
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                Available
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" onClick={onSave}>
                  Save
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Instructor Details</CardTitle>
                    <CardDescription>Detail of instructor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Email</Label>
                        <Input
                          id="name"
                          type="email"
                          className="w-full"
                          value={instructorEditing.email}
                          disabled={instructorEditing.id > 0}
                          onChange={(e) => handleEdit("email", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Password</Label>
                        <Input
                          id="name"
                          type="password"
                          className="w-full"
                          value={instructorEditing.password}
                          onChange={(e) =>
                            handleEdit("password", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          value={instructorEditing.name}
                          onChange={(e) => handleEdit("name", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="code">Code</Label>
                        <Input
                          id="code"
                          type="text"
                          className="w-full"
                          value={instructorEditing.code}
                          disabled={instructorEditing.id > 0}
                          onChange={(e) => handleEdit("code", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="hours">Hours of teaching</Label>
                        <Input
                          id="hours"
                          type="number"
                          className="w-full"
                          value={instructorEditing.hours}
                          onChange={(e) =>
                            handleEdit("hours", Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>
                      Available timeslots in weekly schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScheduleTable
                      initialSchedule={instructorEditing.schedule as string[][]}
                      saveSchedule={(schedule) =>
                        handleEdit("schedule", schedule)
                      }
                    />
                  </CardContent>
                </Card>
                {id && (
                  <div className="flex items-center justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-24"
                      onClick={() => {
                        onDelete(instructorEditing.id.toString());
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Instructor Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={instructorEditing.status}
                          onValueChange={(value) => {
                            handleEdit("status", value);
                          }}
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EStatus.ACTIVE}>
                              Active
                            </SelectItem>
                            <SelectItem value={EStatus.INACTIVE}>
                              Inactive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
