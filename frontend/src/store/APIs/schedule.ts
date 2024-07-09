import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";

export const schedulesApi = createApi({
  reducerPath: "schedulesApi",
  tagTypes: ["schedules"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    upsertSchedule: builder.mutation<
      void,
      {
        university_id: number;
        semester_id: number;
      }
    >({
      query: (data) => ({
        url: `/schedule`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["schedules"],
    }),
    clearEventStream: builder.query<void, void>({
      query: () => ({
        url: `/schedule`,
      }),
      providesTags: ["schedules"],
    }),
  }),
});

export const { useUpsertScheduleMutation, useClearEventStreamQuery } =
  schedulesApi;
