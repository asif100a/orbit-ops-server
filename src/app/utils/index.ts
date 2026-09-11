import type { Response } from "express";

export const catchAsync = (res: Response, error: any) => {
  const isDuplicateError = error?.code === 11000;
  const duplicateField = isDuplicateError
    ? Object.keys(error.keyPattern ?? {})[0]
    : undefined;
  const statusCode = error?.statusCode ?? (isDuplicateError ? 409 : 500);
  const message = isDuplicateError
    ? `A company with this ${duplicateField ?? "value"} already exists`
    : error?.message ?? "Internal server error";

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
