"use client";

import { memo, useCallback } from "react";
import useListInstructors from "./useListInstructors";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";

export const InstructorsTable = memo(function InstructorsTable() {
  const { instructors, isLoading, columns, setFilter } = useListInstructors();

  const onSearch = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, name: value }));
    }, 300),
    []
  );

  if (isLoading || !instructors) return <Skeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={instructors}
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
