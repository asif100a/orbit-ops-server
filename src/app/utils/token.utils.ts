import jwt, { type SignOptions } from "jsonwebtoken";
import { envConfig } from "../config/env";
import AppError from "../errorHandlers/AppError";

const generateAccessToken = (payload: {}) => {
  const accessSecret = envConfig.JWT_ACCESS_SECRET;
  const expiresIn = envConfig.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"];
  if (!accessSecret) {
    throw new AppError(400, "JWT Access token not found!");
  } else if (!expiresIn) {
    throw new AppError(400, "JWT expires in not found!");
  }
  return jwt.sign(payload, accessSecret, {
    expiresIn,
  });
};

const generateRefreshToken = (payload: {}) => {
  const refreshSecret = envConfig.JWT_REFRESH_TOKEN;
  const expiresIn = envConfig.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"];
  if (!refreshSecret) {
    throw new AppError(400, "JWT refresh token not found!");
  } else if (!expiresIn) {
    throw new AppError(400, "JWT expires in not found!");
  }
  return jwt.sign(payload, refreshSecret, {
    expiresIn,
  });
};

const verifyAccessToken = (token: string) => {
  const accessSecret = envConfig.JWT_ACCESS_SECRET;

  if (!accessSecret) {
    throw new AppError(400, "JWT Access token not found!");
  }
  return jwt.verify(token, accessSecret);
};

const verifyRefreshToken = (token: string) => {
  const refreshSecret = envConfig.JWT_REFRESH_TOKEN;

  if (!refreshSecret) {
    throw new AppError(400, "JWT refresh token not found!");
  }
  return jwt.verify(token, refreshSecret);
};

export const handleToken = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}