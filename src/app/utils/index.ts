import type { Response } from "express";

export const catchAsync = (res: Response, error: any) => {
  const statusCode = error?.statusCode ?? (error?.code === 11000 ? 409 : 500);
  const message = error?.message ?? "Internal server error";

  res
    .status(statusCode)
    .json({
      success: false,
      message,
      error: {
        statusCode,
        name: error?.name,
      },
    });
};
