import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const FALLBACK_JWT_SECRET = 'najima_local_jwt_secret';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable must be set in production');
  }
  return FALLBACK_JWT_SECRET;
}

export function verifyToken(request: NextRequest): { valid: boolean; error?: string } {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'No token provided' };
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(token, getJwtSecret());
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid token' };
  }
}

export function signToken(payload: object): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}
