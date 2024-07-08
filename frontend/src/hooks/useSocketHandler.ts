"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocketHandler = (url: string, id: string) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(url, { query: { id } });

    socket.on("progressUpdate", (data) => {
      setProgress(data.progress);
      setStatus(data.status);
    });

    socket.on("dataSignal", (data) => {
      setData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, id]);

  return { progress, status, data };
};
