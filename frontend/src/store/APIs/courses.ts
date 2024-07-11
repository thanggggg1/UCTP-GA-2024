import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { ICourse } from "@/interfaces/course.interfaces";

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  tagTypes: ["courses"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getCourses: builder.query<
      ICourse[],
      {
        name?: string;
        code?: string;
        university_id?: string;
      }
    >({
      query: ({ code, name, university_id }) => ({
        url: `/courses?${new URLSearchParams({
          ...(code && { code }),
          ...(name && { name }),
          ...(university_id && { university_id }),
        }).toString()}`,
      }),
      providesTags: ["courses"],
    }),
    getCourseById: builder.query<
      ICourse,
      {
        id: string;
      }
    >({
      query: (args) => ({
        url: `/courses/${args.id}`,
      }),
      providesTags: ["courses"],
    }),
    createCourse: builder.mutation<void, ICourse>({
      query: (data) => ({
        url: `/courses`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["courses"],
    }),
    updateCourse: builder.mutation<void, ICourse>({
      query: (data) => ({
        url: `/courses/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["courses"],
    }),
    importCourses: builder.mutation<
      void,
      {
        file: File;
        university_id: string;
      }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("university_id", data.university_id);
        return {
          url: "courses/import",
          method: "POST",
          body: formData,
          headers: {
            accept: "application/json",
          },
        };
      },
      invalidatesTags: ["courses"],
    }),
    deleteCourse: builder.mutation<
      void,
      {
        id: number;
      }
    >({
      query: (args) => ({
        url: `/courses/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses"],
    }),
    deleteManyCourses: builder.mutation<
      void,
      {
        ids: number[];
      }
    >({
      query: (args) => ({
        url: `/courses-delete`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: ["courses"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  //mutation
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useImportCoursesMutation,
  useDeleteCourseMutation,
  useDeleteManyCoursesMutation,
} = coursesApi;
