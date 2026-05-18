import type { NextFunction, Request, Response } from "express";

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies();
    } catch (error) {
        
    }
}