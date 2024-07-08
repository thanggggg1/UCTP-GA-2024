"use client";
import { defaultRoomConfig } from "@/config/room.config";
import { useAppDispatch } from "@/store/hooks";
import { loadRoom } from "@/store/modules/rooms";
import { EditRoomConfig } from "@/views/rooms/edit";
import type { NextPage } from "next";
import { useEffect } from "react";

const CreateRoomPage: NextPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadRoom(defaultRoomConfig));
  }, [dispatch]);
  return (
    <>
      <EditRoomConfig />
    </>
  );
};

export default CreateRoomPage;
