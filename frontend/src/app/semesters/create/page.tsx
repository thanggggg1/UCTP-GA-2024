"use client";
import { defaultSemesterConfig } from "@/config/semester.config";
import { useAppDispatch } from "@/store/hooks";
import { loadSemester } from "@/store/modules/semesters";
import { EditSemesterConfig } from "@/views/semesters/edit";
import { useEffect } from "react";
import type { NextPage } from "next";

const CreateSemesterPage: NextPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadSemester(defaultSemesterConfig));
  }, [dispatch]);
  return (
    <>
      <EditSemesterConfig />
    </>
  );
};

export default CreateSemesterPage;
