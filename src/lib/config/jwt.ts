// lib/config/jwt.ts
import jwt from 'jsonwebtoken';

interface JWTPayload {
  id?: string;      // Add this
  sub?: string;     // Add this (standard JWT claim)
  userId?: string;  // Make optional
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Use object directly without intermediate variables
  return jwt.sign(
    payload, 
    secret, 
    {
      expiresIn: '7d',
      issuer: 'aq-interiors-admin',
      audience: 'aq-interiors-users'
    }
  );
};

export const generateTokenPair = (payload: Omit<JWTPayload, 'iat' | 'exp'>) => {
  const accessToken = generateToken(payload);
  
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  const refreshToken = jwt.sign(
    payload, 
    refreshSecret, 
    {
      expiresIn: '7d',
      issuer: 'aq-interiors-admin',
      audience: 'aq-interiors-users'
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret, {
    issuer: 'aq-interiors-admin',
    audience: 'aq-interiors-users'
  }) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  return jwt.verify(token, refreshSecret, {
    issuer: 'aq-interiors-admin',
    audience: 'aq-interiors-users'
  }) as JWTPayload;
};