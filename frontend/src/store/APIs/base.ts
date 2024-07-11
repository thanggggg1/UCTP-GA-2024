import { setCookieWithExpiry } from "@/auth/useLogin";
import { APP_ACCESSTOKEN, APP_REFRESHTOKEN } from "@/config/auth.config";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { getCookie } from "cookies-next";

const renewAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    window.location.href = "/login";
    return;
  }
  try {
    const response = await fetch(`${process.env.HOST}/refresh`, {
      method: "POST",
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      const { accessToken, refreshToken } = await response.json();
      if (accessToken && refreshToken) {
        return {
          access_token: accessToken,
          refreshToken: refreshToken,
        };
      }
    }
    return null;
  } catch (error) {
    console.error(
      "Xảy ra lỗi khi làm mới phiên đăng nhập. Vui lòng đăng nhập lại"
    );
    window.location.href = "/login";
  }
};

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const transformResponse = <T>(response: ApiResponse<T>): T => {
  if ("code" in response && "message" in response && "data" in response) {
    return response.data;
  }

  console.warn("Unexpected response format:", response);
  throw new Error("Unexpected API response format"); // Or return an ApiError
};

export const getBaseQuery = (baseUrl = `${process.env.HOST}/api`) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      let accessToken = "";
      try {
        if (typeof window !== "undefined") {
          accessToken = getCookie(APP_ACCESSTOKEN) || "";
        }
      } catch (error) {
        console.error("Error getting access token from cookie:", error);
      }

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        console.error(
          "Không thể xác định phiên đăng nhập. Vui lòng đăng nhập lại"
        );
        window.location.href = "/login";
        // const refreshToken = getCookie(APP_REFRESHTOKEN) || "";
        // const renew_token = await renewAccessToken(refreshToken);
        // if (
        //   renew_token &&
        //   renew_token.access_token &&
        //   renew_token.refreshToken
        // ) {
        //   setCookieWithExpiry(
        //     APP_ACCESSTOKEN,
        //     renew_token.access_token
        //     // renew_token.access_token_expires_at
        //   );
        //   headers.set("Authorization", `Bearer ${renew_token.access_token}`);
        // } else {

        // }
      }
      return headers;
    },
  });
};
