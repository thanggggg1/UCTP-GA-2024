import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { IChartMetrics, IMetrics } from "@/interfaces/metrics.interfaces";

export const metricsApi = createApi({
  reducerPath: "metricsApi",
  tagTypes: ["metrics"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    // upsertMetrics: builder.mutation<
    //   void,
    //   {
    //     university_id: number;
    //     semester_id: number;
    //   }
    // >({
    //   query: (data) => ({
    //     url: `/schedule`,
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["metrics"],
    // }),
    getMetrics: builder.query<
      IMetrics,
      {
        university_id: number;
      }
    >({
      query: ({ university_id }) => ({
        url: `/metrics${
          university_id ? `?university_id=${university_id}` : ""
        }`,
      }),
      providesTags: ["metrics"],
    }),
    getChartMetrics: builder.query<
      IChartMetrics[],
      {
        university_id: number;
      }
    >({
      query: ({ university_id }) => ({
        url: `/chart-metrics${
          university_id ? `?university_id=${university_id}` : ""
        }`,
      }),
      providesTags: ["metrics"],
    }),
  }),
});

export const { useGetMetricsQuery, useGetChartMetricsQuery } = metricsApi;
