// Custom Application Error class
// Extends native Error with HTTP status codes and operational flags
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      code?: string;
      isOperational?: boolean;
      details?: Record<string, unknown>;
    },
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = options?.isOperational ?? true;
    this.code = options?.code;
    this.details = options?.details;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ============================================
// Predefined Error Classes (4xx - Client Errors)
// ============================================

export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad Request",
    details?: Record<string, unknown>,
  ) {
    super(message, 400, { code: "BAD_REQUEST", details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, { code: "UNAUTHORIZED" });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, { code: "FORBIDDEN" });
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, { code: "NOT_FOUND" });
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409, { code: "CONFLICT" });
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    details?: Record<string, unknown>,
  ) {
    super(message, 422, { code: "VALIDATION_ERROR", details });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, { code: "TOO_MANY_REQUESTS" });
  }
}

// ============================================
// Predefined Error Classes (5xx - Server Errors)
// ============================================

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500, { code: "INTERNAL_SERVER_ERROR", isOperational: false });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service temporarily unavailable") {
    super(message, 503, { code: "SERVICE_UNAVAILABLE" });
  }
}
