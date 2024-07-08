import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const displayErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
) => {
  if (error) {
    const _error = error as {
      status: number;
      data: {
        message: string;
      };
    };

    console.error(_error.data?.message);
    return;
  }
  console.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
  return;
};
