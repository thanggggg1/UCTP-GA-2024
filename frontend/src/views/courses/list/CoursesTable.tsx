"use client";

import { memo, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import useListCourses from "./useListCourses";

export const CoursesTable = memo(function CoursesTable() {
  const { courses, isLoading, columns, setFilter } = useListCourses();

  const onSearch = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, name: value }));
    }, 300),
    []
  );

  if (isLoading || !courses) return <Skeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={courses}
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
