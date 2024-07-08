"use client";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import { EditCourseConfig } from "@/views/courses/edit";

const EditCoursePage: NextPage = () => {
  const { id } = useParams();
  return (
    <>
      <EditCourseConfig id={String(id)} />
    </>
  );
};

export default EditCoursePage;
