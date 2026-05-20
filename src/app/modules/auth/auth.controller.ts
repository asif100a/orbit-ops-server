import type { NextFunction, Request, Response } from "express";
import { UserSchema } from "../user/user.validation";
import { authService } from "./auth.service";

export class AuthController {
  async handleRegister(
    req: Request<{}, {}, UserSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result)
    } catch (error) {
      next(error);
    }
  }
}
