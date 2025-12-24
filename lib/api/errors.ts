/**
 * API Error Handling Utilities
 *
 * Standardized error classes and response formatters for the Horizon Systems API.
 * Provides consistent error handling across all API routes with proper HTTP status codes.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 400 Bad Request - Invalid input or validation error
 */
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request', details?: any) {
    super(400, 'BAD_REQUEST', message, details);
    this.name = 'BadRequestError';
  }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(401, 'UNAUTHORIZED', message, details);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden - Authenticated but lacks permission
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(403, 'FORBIDDEN', message, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(404, 'NOT_FOUND', message, details);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict - Resource conflict (duplicate, version mismatch, etc.)
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(409, 'CONFLICT', message, details);
    this.name = 'ConflictError';
  }
}

/**
 * 422 Unprocessable Entity - Validation error
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(422, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(429, 'RATE_LIMIT_EXCEEDED', message, details);
    this.name = 'RateLimitError';
  }
}

/**
 * 500 Internal Server Error - Unexpected server error
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(500, 'INTERNAL_ERROR', message, details);
    this.name = 'InternalServerError';
  }
}

/**
 * 503 Service Unavailable - External service unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Service unavailable', details?: any) {
    super(503, 'SERVICE_UNAVAILABLE', message, details);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Format error response with standard structure
 */
export function formatErrorResponse(
  error: Error | ApiError,
  path?: string
): NextResponse<ApiErrorResponse> {
  // Handle ApiError instances with proper status codes
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp: new Date().toISOString(),
          path,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: (error as any).errors,
          timestamp: new Date().toISOString(),
          path,
        },
      },
      { status: 422 }
    );
  }

  // Handle Supabase errors
  if ('code' in error && 'message' in error) {
    const supabaseError = error as any;

    // Map common Supabase error codes
    const statusMap: Record<string, number> = {
      '23505': 409, // Unique violation
      '23503': 400, // Foreign key violation
      '42P01': 500, // Undefined table
      PGRST116: 404, // Row not found
      PGRST301: 400, // Invalid query
    };

    const status = statusMap[supabaseError.code] || 500;

    return NextResponse.json(
      {
        error: {
          code: supabaseError.code,
          message: supabaseError.message,
          details: supabaseError.details || supabaseError.hint,
          timestamp: new Date().toISOString(),
          path,
        },
      },
      { status }
    );
  }

  // Generic error handler (don't expose internal errors in production)
  const isDevelopment = process.env.NODE_ENV === 'development';

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: isDevelopment ? error.message : 'An unexpected error occurred',
        details: isDevelopment ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        path,
      },
    },
    { status: 500 }
  );
}

/**
 * Format success response with standard structure
 */
export function formatSuccessResponse<T>(
  data: T,
  meta?: ApiSuccessResponse<T>['meta'],
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

/**
 * Handle async route with automatic error handling
 *
 * Usage:
 * export const GET = asyncHandler(async (req) => {
 *   const data = await fetchData()
 *   return formatSuccessResponse(data)
 * })
 */
export function asyncHandler(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      return formatErrorResponse(
        error instanceof Error ? error : new Error('Unknown error'),
        new URL(req.url).pathname
      );
    }
  };
}

/**
 * Assert condition or throw error
 */
export function assert(condition: boolean, error: ApiError): asserts condition {
  if (!condition) {
    throw error;
  }
}
