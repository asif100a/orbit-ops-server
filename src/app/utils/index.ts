import type { Response } from "express";

export const catchAsync = (res: Response, error: any) => {
  res
    .status(500)
    .json({ success: false, message: "Internal server error", error });
};
