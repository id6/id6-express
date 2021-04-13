import { NextFunction, Request, Response } from 'express';

export class UnauthorizedError extends Error {
  public readonly statusCode = 401;
  constructor(
    public readonly message: string,
    public readonly code: string
  ) {
    super(message);
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next(undefined);
  } else {
    next(new UnauthorizedError('You are not authenticated', 'not_authenticated'));
  }
}
