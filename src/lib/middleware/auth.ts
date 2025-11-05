import { Response, NextFunction } from 'express';
import { NextRequest } from 'next/server';
import { AuthenticatedRequest } from '../../types/index';
import { verifyToken, extractTokenFromHeader } from '../config/jwt';
import { sendErrorResponse } from '../utils/responseHelper';
import Admin from '../models/Admin';
import { connectDB } from '../config/database';

// ========================================
// EXPRESS MIDDLEWARE (Keep for compatibility)
// ========================================
export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      sendErrorResponse('Access token is required', 401);
      return;
    }

    const decoded = verifyToken(token);

    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid or expired token';
    sendErrorResponse( message, 401);
  }
};

// ========================================
// NEXT.JS API ROUTE HELPER (New)
// ========================================
/**
 * Verify authentication token for Next.js API routes
 * Returns success status and decoded token data
 */
export async function verifyAuthToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        message: 'No token provided',
        status: 401
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = verifyToken(token);

      await connectDB();
      const admin = await Admin.findById(decoded.id);

      if (!admin || !admin.isActive) {
        return {
          success: false,
          message: 'Invalid or inactive admin account',
          status: 401
        };
      }

      return {
        success: true,
        admin: {
          id: String(admin._id),
          email: admin.email,
          role: 'admin'
        }
      };

    } catch (tokenError) {
      return {
        success: false,
        message: 'Invalid or expired token',
        status: 401
      };
    }

  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      success: false,
      message: 'Authentication failed',
      status: 500
    };
  }
}