import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { message } from "antd";

export const displayErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
) => {
  message.destroy();
  if (error) {
    const _error = error as {
      status: number;
      data: {
        message: string;
      };
    };

    message.error(_error.data?.message);
    return;
  }
  message.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
  return;
};
