import type { Response } from "express";
import { envConfig } from "../config/env";

const IS_PROD = envConfig.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,
};

export const setAuthCookie = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
};
