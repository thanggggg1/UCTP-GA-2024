"use client";

import { memo, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import useListRooms from "./useListRooms";

export const RoomsTable = memo(function RoomsTable() {
  const { rooms, isLoading, columns, setFilter } = useListRooms();

  const onSearch = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, name: value }));
    }, 300),
    []
  );

  if (isLoading || !rooms) return <Skeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={rooms}
        filterComponent={
          <Input
            placeholder="Filter name..."
            onChange={(event) => onSearch(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        }
      />
    </>
  );
});
