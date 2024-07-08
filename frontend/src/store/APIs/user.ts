import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { ICurrentUser } from "@/interfaces/auth.interfaces";

export const usersApi = createApi({
  reducerPath: "usersApi",
  tagTypes: ["usersInfo"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getCurrentUser: builder.query<ICurrentUser, void>({
      query: () => ({
        url: `/users/info`,
      }),
      providesTags: ["usersInfo"],
    }),
  }),
});

export const { useGetCurrentUserQuery } = usersApi;
