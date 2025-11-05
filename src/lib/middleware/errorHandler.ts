import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/responseHelper';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer errors
  if (error.message.includes('File too large') || error.message.includes('LIMIT_FILE_SIZE')) {
    statusCode = 413;
    message = 'File size too large';
  }

  if (error.message.includes('Only image files are allowed') || error.message.includes('Invalid file type')) {
    statusCode = 400;
    message = 'Invalid file type';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', error);
  }

  sendErrorResponse(res, message, statusCode);
};