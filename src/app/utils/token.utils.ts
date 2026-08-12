import jwt, { type SignOptions } from "jsonwebtoken";
import { envConfig } from "../config/env";
import AppError from "../errorHandlers/AppError";
import type { UserRole } from "../types";

export interface TokenPayloadType {
    id: string;
    email: string;
    role: UserRole
}

// Generate Access token
const generateAccessToken = (payload: TokenPayloadType) => {
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

// Generate Refresh token
const generateRefreshToken = (payload: TokenPayloadType) => {
  const refreshSecret = envConfig.JWT_REFRESH_SECRET;
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

// Generate Verify token
const generateVerifyToken = (payload: {
  id: string,
  email: string,
  purpose: "verify-otp" | "reset-password"
}) => {
  const verifySecret = envConfig.JWT_VERIFY_SECRET
  const expiresIn = envConfig.JWT_VERIFY_EXPIRES_IN as SignOptions['expiresIn']
   if (!verifySecret) {
    throw new AppError(400, "JWT verify token not found!");
  } else if (!expiresIn) {
    throw new AppError(400, "JWT expires in not found!");
  }
  return jwt.sign(payload, verifySecret, {
    expiresIn
  })
}

// Verify Access Token
const verifyAccessToken = (token: string) => {
  const accessSecret = envConfig.JWT_ACCESS_SECRET;

  if (!accessSecret) {
    throw new AppError(400, "JWT Access token not found!");
  }
  return jwt.verify(token, accessSecret);
};

// Verify Refresh Token
const verifyRefreshToken = (token: string) => {
  const refreshSecret = envConfig.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    throw new AppError(400, "JWT refresh token not found!");
  }
  return jwt.verify(token, refreshSecret);
};

// Verify Refresh Token
const verifyToken = (token: string) => {
  const verifySecret = envConfig.JWT_VERIFY_SECRET;

  if (!verifySecret) {
    throw new AppError(400, "JWT verify token not found!");
  }
  return jwt.verify(token, verifySecret);
};


export const handleToken = {
    generateAccessToken,
    generateRefreshToken,
    generateVerifyToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyToken
}