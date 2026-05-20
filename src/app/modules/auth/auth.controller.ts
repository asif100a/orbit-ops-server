import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import type { UserType } from "../user/user.interface";

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
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
