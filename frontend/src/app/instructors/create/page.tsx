"use client";
import { defaultInstructorConfig } from "@/config/instructor.config";
import { useAppDispatch } from "@/store/hooks";
import { loadInstructor } from "@/store/modules/instructors";
import { EditInstructorConfig } from "@/views/instructors/edit";
import type { NextPage } from "next";
import { useEffect } from "react";

const CreateInstructorPage: NextPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadInstructor(defaultInstructorConfig));
  }, [dispatch]);
  return (
    <>
      <EditInstructorConfig />
    </>
  );
};

export default CreateInstructorPage;
