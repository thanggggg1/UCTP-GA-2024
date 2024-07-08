"use client";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import { EditSemesterConfig } from "@/views/semesters/edit";

const EditSemesterPage: NextPage = () => {
  const { id } = useParams();
  return (
    <>
      <EditSemesterConfig id={String(id)} />
    </>
  );
};

export default EditSemesterPage;
