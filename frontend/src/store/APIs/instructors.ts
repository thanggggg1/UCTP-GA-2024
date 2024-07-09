import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { IInstructor } from "@/interfaces/instructor.interfaces";

export const instructorsApi = createApi({
  reducerPath: "instructorsApi",
  tagTypes: ["instructors"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getInstructors: builder.query<
      IInstructor[],
      {
        name?: string;
        code?: string;
        status?: string;
        university_id?: string;
      }
    >({
      query: ({ code, name, status, university_id }) => ({
        url: `/instructors?${new URLSearchParams({
          ...(code && { code }),
          ...(name && { name }),
          ...(status && { status }),
          ...(university_id && { university_id }),
        }).toString()}`,
      }),
      providesTags: ["instructors"],
    }),
    getInstructorById: builder.query<
      IInstructor,
      {
        id: string;
      }
    >({
      query: (args) => ({
        url: `/instructors/${args.id}`,
      }),
      providesTags: ["instructors"],
    }),
    createInstructor: builder.mutation<void, IInstructor>({
      query: (data) => ({
        url: `/instructors`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["instructors"],
    }),
    updateInstructor: builder.mutation<void, IInstructor>({
      query: (data) => ({
        url: `/instructors/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["instructors"],
    }),
    importInstructors: builder.mutation<
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
          url: "instructors/import",
          method: "POST",
          body: formData,
          headers: {
            accept: "application/json",
          },
        };
      },
      invalidatesTags: ["instructors"],
    }),
    deleteInstructor: builder.mutation<
      void,
      {
        id: number;
      }
    >({
      query: (args) => ({
        url: `/instructors/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["instructors"],
    }),
  }),
});

export const {
  useGetInstructorsQuery,
  useGetInstructorByIdQuery,
  //mutation
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useImportInstructorsMutation,
  useDeleteInstructorMutation,
} = instructorsApi;
