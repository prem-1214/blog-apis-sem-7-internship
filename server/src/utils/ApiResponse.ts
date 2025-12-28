import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ErrorDetails,
  PaginationMeta,
} from "@/types/response.types";

// Helper function for success responses
export const successResponse = <T>(
  data: T,
  options?: {
    message?: string;
    pagination?: PaginationMeta;
  },
): ApiSuccessResponse<T> => ({
  success: true,
  data,
  message: options?.message,
  pagination: options?.pagination,
  timestamp: new Date().toISOString(),
});

// Helper function for error responses
export const errorResponse = (
  message: string,
  error: ErrorDetails,
): ApiErrorResponse => ({
  success: false,
  message,
  error,
  timestamp: new Date().toISOString(),
});

// Pagination helper
export const createPagination = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
