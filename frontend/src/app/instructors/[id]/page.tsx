"use client";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import { EditInstructorConfig } from "@/views/instructors/edit";

const EditInstructorPage: NextPage = () => {
  const { id } = useParams();
  return (
    <>
      <EditInstructorConfig id={String(id)} />
    </>
  );
};

export default EditInstructorPage;
