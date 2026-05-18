import type { NextFunction, Request, Response } from "express";

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies();
        console.log('Access token from the checkAuth: ', accessToken)

        // Call the next function
        next()
    } catch (error) {
        console.log('❌ Auth check error: ', error)
        next(error)
    }
}