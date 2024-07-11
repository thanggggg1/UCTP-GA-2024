"use client";

import { memo, useCallback, useState } from "react";
import useListInstructors from "./useListInstructors";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { CustomTableButton } from "@/components/CustomTableButton";
import { useDeleteManyInstructorsMutation } from "@/store/APIs/instructors";

export const InstructorsTable = memo(function InstructorsTable() {
  const { instructors, isLoading, columns, setFilter } = useListInstructors();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteMany] = useDeleteManyInstructorsMutation();
  const onSearch = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, name: value }));
    }, 300),
    []
  );

  const onDelete = useCallback(() => {
    deleteMany({ ids: selectedIds });
  }, [deleteMany, selectedIds]);

  if (isLoading || !instructors) return <Skeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={instructors}
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
