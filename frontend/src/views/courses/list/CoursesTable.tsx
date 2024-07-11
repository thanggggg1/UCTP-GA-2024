"use client";

import { memo, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import useListCourses from "./useListCourses";
import { useDeleteManyCoursesMutation } from "@/store/APIs/courses";
import { CustomTableButton } from "@/components/CustomTableButton";

export const CoursesTable = memo(function CoursesTable() {
  const { courses, isLoading, columns, setFilter } = useListCourses();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteMany] = useDeleteManyCoursesMutation();

  const onSearch = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, name: value }));
    }, 300),
    []
  );

  const onDelete = useCallback(() => {
    deleteMany({ ids: selectedIds });
  }, [deleteMany, selectedIds]);

  if (isLoading || !courses) return <Skeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={courses}
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
