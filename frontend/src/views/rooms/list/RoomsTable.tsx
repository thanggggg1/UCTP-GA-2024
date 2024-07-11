"use client";

import { memo, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import useListRooms from "./useListRooms";
import { useDeleteManyRoomsMutation } from "@/store/APIs/rooms";
import { CustomTableButton } from "@/components/CustomTableButton";

export const RoomsTable = memo(function RoomsTable() {
  const { rooms, isLoading, columns, setFilter } = useListRooms();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteMany] = useDeleteManyRoomsMutation();

  const onSearch = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, name: value }));
    }, 300),
    []
  );

  const onDelete = useCallback(() => {
    deleteMany({ ids: selectedIds });
  }, [deleteMany, selectedIds]);

  if (isLoading || !rooms) return <Skeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={rooms}
        setSelectedIds={setSelectedIds}
        filterComponent={
          <>
            <Input
              placeholder="Filter name..."
              onChange={(event) => onSearch(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {selectedIds.length > 0 && <CustomTableButton onClick={onDelete} />}
          </>
        }
      />
    </>
  );
});
