/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../../../configurations/auth.conf';
import AppError from '../../../../../shared/errors/AppError';

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const auth = request.headers.authorization;

  if (!auth) throw new AppError('Missing Auth Token', 401);

  const [, token] = auth.split(' ');
  console.log(token);

  try {
    const jwt = verify(token, authConfig.jwt.secret);
    request.user = { id: (jwt as JwtPayload).sub };
    next();
  } catch (error) {
    console.log(error);
    throw new AppError('Invalid token', 401);
  }
}
