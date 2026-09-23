import type { Request, Response } from "express";
import AppError from "../../errorHandlers/AppError";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils";

const userService = new UserService()

export class UserController {
    async getAll(req: Request, res: Response) {
        
    }

    async getById(req: Request, res: Response) {
        
    }

    async getMyProfile(req: Request, res: Response) {
        const body = req.body;
        if(!body) {
            throw new AppError(400, "Body data missing");
        }
        const userId = body.id
        if(!userId) {
            throw new AppError(400, "User Id is missing")
        }

        try {
            const result = await userService.myProfile(userId);

            res.status(200).json({
                success: true,
                message: "Profile data retrieved successfully",
                data: result
            })
        } catch (error) {
            catchAsync(res, error);
        }
    }
}