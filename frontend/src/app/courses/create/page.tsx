"use client";
import { defaultCourseConfig } from "@/config/course.config";
import { useAppDispatch } from "@/store/hooks";
import { loadCourse } from "@/store/modules/courses";
import { EditCourseConfig } from "@/views/courses/edit";
import type { NextPage } from "next";
import { useEffect } from "react";

const CreateCoursePage: NextPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadCourse(defaultCourseConfig));
  }, [dispatch]);
  return (
    <>
      <EditCourseConfig />
    </>
  );
};

export default CreateCoursePage;
