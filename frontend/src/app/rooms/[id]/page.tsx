"use client";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import { EditRoomConfig } from "@/views/rooms/edit";

const EditRoomPage: NextPage = () => {
  const { id } = useParams();
  return (
    <>
      <EditRoomConfig id={String(id)} />
    </>
  );
};

export default EditRoomPage;
