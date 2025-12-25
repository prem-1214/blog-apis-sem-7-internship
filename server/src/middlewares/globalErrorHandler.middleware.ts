import { NextFunction, Request, Response } from "express";

import { AppError } from "@/utils/AppError";

export const globalErrorHandler = (
  error: Error | AppError | unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Unknown error occurred",
  });
};
