import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { config } from "@/config/config";
import { AppError } from "@/utils/AppError";
import { logger } from "@/utils/logger";


// Error response interface for type safety
interface ErrorResponse {
  success: false;
  statusCode: number;
  status: "fail" | "error";
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  stack?: string;
  timestamp: string;
  path: string;
}

// Format Zod validation errors into readable format
const formatZodError = (error: ZodError): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};
  error.issues.forEach((issue) => {
    const path = issue.path.join(".") || "field";
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  });
  return formatted;
};

// Handle duplicate key errors (MongoDB)
const handleDuplicateKeyError = (
  error: Error & { keyValue?: Record<string, unknown> },
): AppError => {
  const field = Object.keys(error.keyValue || {})[0];
  const message = `${field} already exists`;
  return new AppError(message, 409, { code: "DUPLICATE_KEY" });
};

// Handle MongoDB CastError
const handleCastError = (
  error: Error & { path?: string; value?: unknown },
): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400, { code: "INVALID_ID" });
};

// Handle JWT errors
const handleJWTError = (): AppError => {
  return new AppError("Invalid token. Please log in again.", 401, {
    code: "INVALID_TOKEN",
  });
};

const handleJWTExpiredError = (): AppError => {
  return new AppError("Token expired. Please log in again.", 401, {
    code: "TOKEN_EXPIRED",
  });
};

// Global Error Handler Middleware
// Catches all errors and sends standardized response
export const globalErrorHandler = (
  error: Error | AppError | ZodError | unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Default error values
  let statusCode = 500;
  let status: "fail" | "error" = "error";
  let message = "Something went wrong";
  let code: string | undefined = "INTERNAL_ERROR";
  let details: Record<string, unknown> | undefined;
  let stack: string | undefined;

  // Log error for debugging
  logger.error("Error caught by global handler:", {
    name: error instanceof Error ? error.name : "Unknown",
    message: error instanceof Error ? error.message : String(error),
    path: req.originalUrl,
    method: req.method,
  });

  // Handle known error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    status = error.status;
    message = error.message;
    code = error.code;
    details = error.details;
    stack = error.stack;
  } else if (error instanceof ZodError) {
    statusCode = 422;
    status = "fail";
    message = "Validation failed";
    code = "VALIDATION_ERROR";
    details = { errors: formatZodError(error) };
  } else if (error instanceof Error) {
    // Handle specific error types by name
    if (error.name === "CastError") {
      const appError = handleCastError(
        error as Error & { path?: string; value?: unknown },
      );
      statusCode = appError.statusCode;
      message = appError.message;
      code = appError.code;
    } else if (
      error.name === "MongoServerError" &&
      (error as Error & { code?: number }).code === 11000
    ) {
      const appError = handleDuplicateKeyError(
        error as Error & { keyValue?: Record<string, unknown> },
      );
      statusCode = appError.statusCode;
      message = appError.message;
      code = appError.code;
    } else if (error.name === "JsonWebTokenError") {
      const appError = handleJWTError();
      statusCode = appError.statusCode;
      message = appError.message;
      code = appError.code;
    } else if (error.name === "TokenExpiredError") {
      const appError = handleJWTExpiredError();
      statusCode = appError.statusCode;
      message = appError.message;
      code = appError.code;
    } else {
      message = error.message || message;
      stack = error.stack;
    }
  }

  // Build response object
  const errorResponse: ErrorResponse = {
    success: false,
    statusCode,
    status,
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Include stack trace only in development
  if (config.get("NODE_ENV") === "development" && stack) {
    errorResponse.stack = stack;
  }

  // Remove undefined fields
  (Object.keys(errorResponse) as Array<keyof ErrorResponse>).forEach((key) => {
    if (errorResponse[key] === undefined) {
      delete errorResponse[key];
    }
  });

  res.status(statusCode).json(errorResponse);
};
