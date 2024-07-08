import { DataTableColumnHeader } from "@/components/DataTableComlumHeader";
import { DataTableRowActions } from "@/components/DataTableRowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { EStatus } from "@/enums/share.enum";
import { useCreateStatusMessages } from "@/hooks/useStatusMessage";
import { ICourse } from "@/interfaces/course.interfaces";

import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from "@/store/APIs/courses";
import { useGetCurrentUserQuery } from "@/store/APIs/user";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const useListCourses = () => {
  const [deleteCourse, { isLoading: isDeleting, isSuccess: deleteSuccess }] =
    useDeleteCourseMutation();

  const [filter, setFilter] = useState<{
    code?: string;
    name?: string;
    university_id?: string;
  }>({
    code: "",
    name: "",
    university_id: "",
  });

  const { data: currentUser } = useGetCurrentUserQuery();

  const router = useRouter();

  const { data, isLoading } = useGetCoursesQuery({
    ...filter,
    university_id: currentUser?.UniversityID.toString() || "",
  });

  const onDelete = useCallback((id: string) => {
    deleteCourse({ id: Number(id) });
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      router.push("/courses");
    }
  }, [deleteSuccess, router]);

  const [
    create,
    {
      isLoading: isCreating,
      error: createError,
      isError: isCreatingError,
      isSuccess: isCreatingSuccess,
    },
  ] = useCreateCourseMutation();
  const [
    update,
    {
      isLoading: isUpdating,
      error: updateError,
      isSuccess: isUpdateSucces,
      isError: isUpdateError,
    },
  ] = useUpdateCourseMutation();

  useCreateStatusMessages({
    isLoading: isCreating,
    isError: isCreatingError,
    isSuccess: isCreatingSuccess,
    error: createError,
    title: "Course",
    action: "Create",
  });

  useCreateStatusMessages({
    isLoading: isUpdating,
    isError: isUpdateError,
    isSuccess: isUpdateSucces,
    error: updateError,
    title: "Course",
    action: "Update",
  });

  const columns: ColumnDef<ICourse>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <div className="w-[10px]">{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course code" />
      ),
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code_hp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course class code" />
      ),
      cell: ({ row }) => <div>{row.getValue("code_hp")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "hours",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time duration" />
      ),
      cell: ({ row }) => <div>{row.getValue("hours")}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <>
          <DataTableRowActions
            onEdit={() => {
              router.push(`/courses/${row.getValue("id")}`);
            }}
            onDelete={() => {
              onDelete(row.getValue("id"));
            }}
          />
        </>
      ),
    },
  ];

  return {
    courses: data,
    isLoading,
    columns,
    onDelete,
    update,
    create,
    filter,
    setFilter,
  };
};
export default useListCourses;
