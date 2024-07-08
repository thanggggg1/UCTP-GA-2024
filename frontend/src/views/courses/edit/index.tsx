"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import useListCourses from "../list/useListCourses";
import { useGetCourseByIdQuery } from "@/store/APIs/courses";
import { useCallback, useEffect, useMemo } from "react";
import { editCourse, loadCourse } from "@/store/modules/courses";
import { defaultCourseConfig } from "@/config/course.config";
import { ICourse } from "@/interfaces/course.interfaces";
import { ValueOf } from "@/types/common";
import { ERoomType } from "@/enums/share.enum";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import useListInstructors from "@/views/instructors/list/useListInstructors";
import { useGetCurrentUserQuery } from "@/store/APIs/user";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

export function EditCourseConfig({ id }: { id?: number | string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const courseEditing = useAppSelector((state) => state.course.courseEditing);
  // const [modalVisible, show, hide, toggle] = useBoolean();
  const { onDelete, create, update } = useListCourses();

  const { instructors } = useListInstructors();

  const { data, isLoading } = useGetCourseByIdQuery(
    {
      id: String(id),
    },
    { skip: !id }
  );

  const { data: currentUser } = useGetCurrentUserQuery();

  const instructorOptions = useMemo(() => {
    if (!instructors) return [];
    return instructors.map((instructor) => ({
      label: instructor.name,
      value: instructor.id.toString(),
    }));
  }, [instructors]);

  const handleEdit = useCallback(
    (key: keyof ICourse, value: ValueOf<ICourse>) => {
      dispatch(
        editCourse({
          path: [key],
          value,
        })
      );
    },
    []
  );

  const onSave = useCallback(() => {
    if (courseEditing.instructor_ids.length === 0) {
      toast.warning("You have to assigned ");
      return;
    }
    if (id) {
      update({
        ...courseEditing,
        university_id: Number(currentUser?.UniversityID) || 0,
      });
    } else {
      create({
        ...courseEditing,
        university_id: Number(currentUser?.UniversityID) || 0,
      });
      router.push("/courses");
    }
  }, [id, courseEditing]);

  useEffect(() => {
    if (!id) {
      dispatch(loadCourse(defaultCourseConfig));
    } else if (data) {
      dispatch(loadCourse(data));
    }
  }, [dispatch, data, id]);

  console.log("courseEditing", courseEditing);

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
                  {id ? "Edit Course" : "Create Course"}
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
                  router.push("/courses");
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {courseEditing.name || "Create Course"}
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
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>Detail of course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          value={courseEditing.name}
                          onChange={(e) => handleEdit("name", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="code">Code</Label>
                        <Input
                          id="code"
                          type="text"
                          className="w-full"
                          value={courseEditing.code}
                          disabled={courseEditing.id > 0}
                          onChange={(e) => handleEdit("code", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="code_hp">Class Code</Label>
                        <Input
                          id="code_hp"
                          type="text"
                          className="w-full"
                          value={courseEditing.code_hp}
                          disabled={courseEditing.id > 0}
                          onChange={(e) =>
                            handleEdit("code_hp", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="instructor_ids">Instructors</Label>
                        <MultiSelect
                          options={instructorOptions}
                          placeholder="Select instructors for this course..."
                          value={courseEditing?.instructor_ids?.map((id) =>
                            id.toString()
                          )}
                          defaultValue={courseEditing?.instructor_ids?.map(
                            (id) => id.toString()
                          )}
                          onValueChange={(value) => {
                            handleEdit("instructor_ids", value.map(Number));
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="hours">Time duration</Label>
                        <Input
                          id="hours"
                          type="number"
                          min={0}
                          max={5}
                          className="w-full"
                          value={courseEditing.hours}
                          onChange={(e) =>
                            handleEdit("hours", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          placeholder="Type your course description here."
                          id="description"
                        />
                      </div>
                      <div className="grid gap-3 row-auto">
                        <Checkbox id="divisible" />
                        <label
                          htmlFor="divisible"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Divisible
                        </label>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="type">Course Type</Label>
                        <Select
                          value={courseEditing.type}
                          onValueChange={(value) => {
                            handleEdit("type", value);
                          }}
                        >
                          <SelectTrigger id="type" aria-label="Select type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ERoomType.LEC}>
                              Lecture course
                            </SelectItem>
                            <SelectItem value={ERoomType.LAB}>
                              Lab course
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {id && (
                  <div className="flex items-center justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-24"
                      onClick={() => {
                        onDelete(courseEditing.id.toString());
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
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
