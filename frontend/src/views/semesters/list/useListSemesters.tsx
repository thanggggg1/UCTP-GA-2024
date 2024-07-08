import { DataTableColumnHeader } from "@/components/DataTableComlumHeader";
import { DataTableRowActions } from "@/components/DataTableRowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { EStatus } from "@/enums/share.enum";
import { useCreateStatusMessages } from "@/hooks/useStatusMessage";
import { ISemester } from "@/interfaces/semester.interfaces";
import {
  useCreateSemesterMutation,
  useDeleteSemesterMutation,
  useGetSemestersQuery,
  useUpdateSemesterMutation,
} from "@/store/APIs/semesters";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const useListSemesters = () => {
  const [deleteSemester, { isLoading: isDeleting, isSuccess: deleteSuccess }] =
    useDeleteSemesterMutation();

  const router = useRouter();

  const { data, isLoading } = useGetSemestersQuery();

  const onDelete = useCallback(
    (id: string) => {
      deleteSemester({ id: Number(id) });
    },
    [deleteSemester]
  );

  useEffect(() => {
    if (deleteSuccess) {
      router.push("/semesters");
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
  ] = useCreateSemesterMutation();
  const [
    update,
    {
      isLoading: isUpdating,
      error: updateError,
      isSuccess: isUpdateSucces,
      isError: isUpdateError,
    },
  ] = useUpdateSemesterMutation();

  useCreateStatusMessages({
    isLoading: isCreating,
    isError: isCreatingError,
    isSuccess: isCreatingSuccess,
    error: createError,
    title: "Semester",
    action: "Create",
  });

  useCreateStatusMessages({
    isLoading: isUpdating,
    isError: isUpdateError,
    isSuccess: isUpdateSucces,
    error: updateError,
    title: "Semester",
    action: "Update",
  });

  const columns: ColumnDef<ISemester>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Semester name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "courses",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Number of courses" />
      ),
      cell: ({ row }) => <div>{row.original.courses?.length}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="flex w-[100px] items-center">
            {status === EStatus.ACTIVE ? (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                Active
              </span>
            ) : (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full">
                Inactive
              </span>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <>
          <DataTableRowActions
            onEdit={() => {
              router.push(`/semesters/${row.getValue("id")}`);
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
    semesters: data,
    isLoading,
    columns,
    onDelete,
    update,
    create,
  };
};
export default useListSemesters;
