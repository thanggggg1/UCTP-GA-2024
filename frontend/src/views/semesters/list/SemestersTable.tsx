"use client";

import { memo, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import useListSemesters from "./useListSemesters";

export const SemestersTable = memo(function SemestersTable() {
  const { semesters, isLoading, columns } = useListSemesters();

  if (isLoading || !semesters) return <Skeleton />;

  return (
    <>
      <DataTable columns={columns} data={semesters} />
    </>
  );
});
