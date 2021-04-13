import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

export class AuthorizationError extends Error {
  public readonly statusCode: number = 500;

  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly details: string,
  ) {
    super();
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth;
  if (!token) {
    return next();
  }
  axios
    .post(`${process.env.ID6_AUTHORIZATION_URL}/authorize`, { token }, {
      headers: {
        Authorization: process.env.ID6_AUTHORIZATION_SECRET,
      },
    })
    .then(({ data: { user, error } }) => {
      if (error) {
        return next(new AuthorizationError('Could not authorize request','validation_error', error));
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new AuthorizationError('Could not authorize request', 'axios_error',err));
    });
}
