import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../../config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  id: number;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: 'JWT Token is missing' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return response.status(401).json({ message: 'JWT Token is missing' });
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { id } = decoded as ITokenPayload;

    request.user = {
      id,
    };

    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid JWT Token.' });
  }
}