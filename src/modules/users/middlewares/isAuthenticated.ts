import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodeToken = verify(token, authConfig.jwt.secret);

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT Token', 401);
  }
}
