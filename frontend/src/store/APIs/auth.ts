import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformResponse } from "./base";
import {
  ILoginResponse,
  LoginParams,
  SignUpParams,
} from "@/interfaces/auth.interfaces";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["auth", "user"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.HOST}`,
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<ILoginResponse, LoginParams>({
      query: (data) => ({
        url: `/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    signUp: builder.mutation<string, SignUpParams>({
      query: (data) => ({
        url: `/signup`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  // mutation
  useSignInMutation,
  useSignUpMutation,
} = authApi;
