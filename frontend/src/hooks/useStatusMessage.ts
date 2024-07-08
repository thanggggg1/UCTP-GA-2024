import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { toast } from "sonner";

interface UseCreateStatusMessagesProps {
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined; // Giả sử lỗi là string hoặc null
  isSuccess: boolean;
  isError: boolean;
  title: string;
  action: string;
}

export function useCreateStatusMessages({
  isLoading,
  isError,
  isSuccess,
  error,
  title,
  action,
}: UseCreateStatusMessagesProps) {
  useEffect(() => {
    if (isLoading) {
      toast.loading(`Đang ${action} ${title}...`);
    } else if (isError) {
      toast.dismiss();
      toast.error(`Lỗi khi ${action} ${title} - ${error}`); // Hiển thị chi tiết lỗi
    } else if (isSuccess) {
      toast.dismiss();
      toast.success(`${action}  ${title} thành công`);
    }
  }, [isSuccess, isLoading, isError, error, title, action]);
}
