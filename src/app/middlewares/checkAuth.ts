import type { NextFunction, Request, Response } from "express";
import { handleToken, type TokenPayloadType } from "../utils/token.utils";

// Extend Express Request to carry decoded user
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
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        res.status(401).json({
          success: false,
          message: "Access token missing",
        });
        return;
      }
      console.log("Access token from the checkAuth: ", accessToken);

      req.body = handleToken.verifyAccessToken(accessToken);
      // Call the next function
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
  };
