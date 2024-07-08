import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base";
import { IRoom } from "@/interfaces/room.interfaces";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  tagTypes: ["rooms"],
  baseQuery: getBaseQuery(),

  endpoints: (builder) => ({
    getRooms: builder.query<
      IRoom[],
      {
        name?: string;
        code?: string;
        status?: string;
        university_id?: string;
      }
    >({
      query: ({ code, name, status, university_id }) => ({
        url: `/rooms?${new URLSearchParams({
          ...(code && { code }),
          ...(name && { name }),
          ...(status && { status }),
          ...(university_id && { university_id }),
        }).toString()}`,
      }),
      providesTags: ["rooms"],
    }),
    getRoomById: builder.query<
      IRoom,
      {
        id: string;
      }
    >({
      query: (args) => ({
        url: `/rooms/${args.id}`,
      }),
      providesTags: ["rooms"],
    }),
    createRoom: builder.mutation<void, IRoom>({
      query: (data) => ({
        url: `/rooms`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["rooms"],
    }),
    updateRoom: builder.mutation<void, IRoom>({
      query: (data) => ({
        url: `/rooms/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["rooms"],
    }),
    importRooms: builder.mutation<
      void,
      {
        file: File;
        university_id: number;
      }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("university_id", data.university_id.toString());
        return {
          url: "rooms/import",
          method: "POST",
          body: formData,
          headers: {
            accept: "application/json",
          },
        };
      },
      invalidatesTags: ["rooms"],
    }),
    deleteRoom: builder.mutation<
      void,
      {
        id: number;
      }
    >({
      query: (args) => ({
        url: `/rooms/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["rooms"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  //mutation
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useImportRoomsMutation,
  useDeleteRoomMutation,
} = roomsApi;
