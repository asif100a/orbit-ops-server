import type { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/env";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
let message = "Something went wrong!"

// Handle known errors
if(err.message === "bcrypt salt not found" || err.message.includes('BCRYPT_SALT')) {
    statusCode = 500
    message: "Server configuration error: Bcrypt salt is missing"
}else if(err.name === 'ValidationError') {
    statusCode = 400
    message = err.message;
}else if(err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value found";
}

// Final response
res.status(statusCode).json({
    success: false,
    message,
    err: envConfig.NODE_ENV === 'development' ? err.stack : undefined
})
}