import type { NextFunction, Request, Response } from "express";
import { handleToken, type TokenPayloadType } from "../utils/token.utils";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayloadType;
    }
  }
}

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.accessToken;

      if (!accessToken) {
        res.status(401).json({
          success: false,
          message: "Access token missing",
        });
        return;
      }

      const decoded = handleToken.verifyAccessToken(accessToken);

      if (
        typeof decoded === "string" ||
        !decoded.id ||
        !decoded.email ||
        !decoded.role
      ) {
        res.status(401).json({
          success: false,
          message: "Invalid access token",
        });
        return;
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role as TokenPayloadType["role"],
      };

      if (authRoles.length > 0 && !authRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: "You are not authorized",
        });
        return;
      }

      next();
    } catch {
      res.status(403).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
  };