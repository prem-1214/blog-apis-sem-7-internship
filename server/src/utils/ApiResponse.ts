import { Response } from "express";


// Standardized API Response class for consistent response structure
// Used across all controllers for success responses
 
export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data?: T;
  public readonly timestamp: string;
  public readonly path?: string;

  constructor(statusCode: number, message: string, data?: T, path?: string) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}


// Helper function to send standardized success response

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response => {
  const response = new ApiResponse<T>(
    statusCode,
    message,
    data,
    res.req?.originalUrl,
  );
  return res.status(statusCode).json(response);
};

// Common response helpers for cleaner controller code

export const ResponseHelper = {
  // 200 OK - Standard success response
  ok: <T>(res: Response, message: string, data?: T) =>
    sendResponse(res, 200, message, data),

  // 201 Created - Resource created successfully
  created: <T>(res: Response, message: string, data?: T) =>
    sendResponse(res, 201, message, data),

  // 204 No Content - Success with no response body
  noContent: (res: Response, message: string = "No content") =>
    sendResponse(res, 204, message),

  // 202 Accepted - Request accepted for processing
  accepted: <T>(res: Response, message: string, data?: T) =>
    sendResponse(res, 202, message, data),
};
