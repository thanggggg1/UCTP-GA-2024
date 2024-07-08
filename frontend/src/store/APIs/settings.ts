import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  tagTypes: ["settings"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getSettingById: builder.query<
      ISetting,
      {
        university_id: string;
      }
    >({
      query: (args) => ({
        url: `/settings?university_id=${args.university_id}`,
      }),
      providesTags: ["settings"],
    }),
    createSetting: builder.mutation<void, ISetting>({
      query: (data) => ({
        url: `/settings`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    updateSetting: builder.mutation<void, ISetting>({
      query: (data) => ({
        url: `/settings/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),

    deleteSetting: builder.mutation<
      void,
      {
        id: number;
      }
    >({
      query: (args) => ({
        url: `/settings/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["settings"],
    }),
  }),
});

export const {
  useGetSettingByIdQuery,
  //mutation
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
} = settingsApi;
