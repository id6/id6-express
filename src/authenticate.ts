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

export function authenticate({url, secret}: {
  url: string;
  secret: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth;
    if (!token) {
      return next();
    }
    axios
      .post(`${url}/authorize`, { token }, {
        headers: {
          Authorization: secret,
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
}
