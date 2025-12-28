// Pagination metadata for list responses
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Error details for error responses
export interface ErrorDetails {
  code: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// Success response structure
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
  timestamp: string;
}

// Error response structure
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: ErrorDetails;
  timestamp: string;
}

// Union type for all API responses
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
