import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { ISemester } from "@/interfaces/semester.interfaces";

export const semestersApi = createApi({
  reducerPath: "semestersApi",
  tagTypes: ["semesters"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getSemesters: builder.query<ISemester[], void>({
      query: () => ({
        url: `/semesters`,
      }),
      providesTags: ["semesters"],
    }),
    getSemesterById: builder.query<
      ISemester,
      {
        id: string;
      }
    >({
      query: (args) => ({
        url: `/semesters/${args.id}`,
      }),
      providesTags: ["semesters"],
    }),
    createSemester: builder.mutation<void, ISemester>({
      query: (data) => ({
        url: `/semesters`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["semesters"],
    }),
    updateSemester: builder.mutation<void, ISemester>({
      query: (data) => ({
        url: `/semesters/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["semesters"],
    }),

    deleteSemester: builder.mutation<
      void,
      {
        id: number;
      }
    >({
      query: (args) => ({
        url: `/semesters/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["semesters"],
    }),
  }),
});

export const {
  useGetSemestersQuery,
  useGetSemesterByIdQuery,
  //mutation
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = semestersApi;
