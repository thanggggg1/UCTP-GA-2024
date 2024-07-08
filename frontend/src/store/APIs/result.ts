import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { IResult } from "@/interfaces/result.interface";

export const resultsApi = createApi({
  reducerPath: "resultsApi",
  tagTypes: ["resultsInfo"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getResult: builder.query<
      IResult,
      {
        university_id: string;
        semester_id: string;
      }
    >({
      query: ({ semester_id, university_id }) => ({
        url: `/result?${new URLSearchParams({
          ...(university_id && { university_id }),
          ...(semester_id && { semester_id }),
        }).toString()}`,
      }),
      providesTags: ["resultsInfo"],
    }),
  }),
});

export const { useGetResultQuery } = resultsApi;
