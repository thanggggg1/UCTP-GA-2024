import { DataTableColumnHeader } from "@/components/DataTableComlumHeader";
import { DataTableRowActions } from "@/components/DataTableRowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { EStatus } from "@/enums/share.enum";
import { useCreateStatusMessages } from "@/hooks/useStatusMessage";
import { IRoom } from "@/interfaces/room.interfaces";

import {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useUpdateRoomMutation,
} from "@/store/APIs/rooms";
import { useGetCurrentUserQuery } from "@/store/APIs/user";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const useListRooms = () => {
  const [deleteRoom, { isLoading: isDeleting, isSuccess: deleteSuccess }] =
    useDeleteRoomMutation();

  const [filter, setFilter] = useState<{
    code?: string;
    name?: string;
    status?: string;
    university_id?: string;
  }>({
    code: "",
    name: "",
    status: "",
    university_id: "",
  });

  const router = useRouter();

  const { data: currentUser } = useGetCurrentUserQuery();

  const { data, isLoading } = useGetRoomsQuery({
    ...filter,
    university_id: currentUser?.UniversityID.toString(),
  });

  const onDelete = useCallback((id: string) => {
    deleteRoom({ id: Number(id) });
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      router.push("/rooms");
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
  ] = useCreateRoomMutation();
  const [
    update,
    {
      isLoading: isUpdating,
      error: updateError,
      isSuccess: isUpdateSucces,
      isError: isUpdateError,
    },
  ] = useUpdateRoomMutation();

  useCreateStatusMessages({
    isLoading: isCreating,
    isError: isCreatingError,
    isSuccess: isCreatingSuccess,
    error: createError,
    title: "Room",
    action: "Create",
  });

  useCreateStatusMessages({
    isLoading: isUpdating,
    isError: isUpdateError,
    isSuccess: isUpdateSucces,
    error: updateError,
    title: "Room",
    action: "Update",
  });

  const columns: ColumnDef<IRoom>[] = [
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
        <DataTableColumnHeader column={column} title="Room code" />
      ),
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Room Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
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
              router.push(`/rooms/${row.getValue("id")}`);
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
    rooms: data,
    isLoading,
    columns,
    onDelete,
    update,
    create,
    filter,
    setFilter,
  };
};
export default useListRooms;
