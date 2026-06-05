import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import type { UserType } from "../user/user.interface";
import { clearAuthCookies, setAuthCookie } from "../../utils/cookie.utils";
import type { VerifyOtp } from "./auth.validation";
import AppError from "../../errorHandlers/AppError";
import { handleToken } from "../../utils/token.utils";

export class AuthController {
  async handleRegister(
    req: Request<{}, {}, UserType>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await authService.login(
        req.body,
      );

      setAuthCookie(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleRefresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const { accessToken, refreshToken: newRefreshToken } =
        await authService.refresh(refreshToken);

      setAuthCookie(res, accessToken, newRefreshToken);

      res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      await authService.logout(refreshToken);
      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async handleVerifyOtp(
    req: Request<{}, {}, VerifyOtp>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new AppError(401, "Verify token is missing");
      }
      const verifyToken = authHeader.split(" ")[1]
      if(!verifyToken) {
        throw new AppError(401, "Verify token is missing");
      }
      const decoded = handleToken.verifyToken(verifyToken)
      if(typeof decoded === 'string' || decoded.purpose !== 'verify-otp') {
        throw new AppError(401, "Invalid verify token")
      }
      const {email} = decoded;
      const { otp } = req.body;
      const {user, accessToken, refreshToken} = await authService.verifyOtp(email, otp);

      setAuthCookie(res, accessToken, refreshToken)

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
