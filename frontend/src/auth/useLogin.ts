import { setCookie } from "cookies-next";
import { APP_ACCESSTOKEN, APP_REFRESHTOKEN } from "../config/auth.config";

export const setCookieWithExpiry = (
  name: string,
  value: string
  // expires_at: Date
) => {
  setCookie(name, value, {
    //set expires in 2 hours
    expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    // expires: expires_at,
    // httpOnly: true, // Optionally, make it HTTP-only for security
    secure: process.env.NODE_ENV === "production", // Secure flag for production
    sameSite: "strict", // SameSite attribute for CSRF protection
  });
};
export const handleLogin = ({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token: string;
  // access_token_expires_at: Date;
  // refresh_token_expires_at: Date;
}) => {
  if (access_token && refresh_token) {
    setCookieWithExpiry(APP_ACCESSTOKEN, access_token);
    setCookieWithExpiry(APP_REFRESHTOKEN, refresh_token);
  }
};
