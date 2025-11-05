import { NextResponse } from 'next/server';

/**
 * Send success response
 * @param message - Success message
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 */
export const sendSuccessResponse = (
  message: string,
  data?: any,
  status: number = 200
): NextResponse => {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status }
  );
};

/**
 * Send error response
 * @param message - Error message
 * @param status - HTTP status code (default: 500)
 * @param errors - Additional error details
 */
export const sendErrorResponse = (
  message: string,
  status: number = 500,
  errors?: any
): NextResponse => {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors })
    },
    { status }
  );
};