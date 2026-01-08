import { Request, Response, NextFunction } from 'express';
import { DomainError, ValidationError, NotFoundError, ConflictError } from '../../../domain/errors/DomainErrors';

/**
 * Error Handler Middleware
 * Centralized error handling following clean code principles
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ValidationError) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      type: 'ValidationError',
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      status: 'error',
      message: error.message,
      type: 'NotFoundError',
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({
      status: 'error',
      message: error.message,
      type: 'ConflictError',
    });
    return;
  }

  if (error instanceof DomainError) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      type: error.name,
    });
    return;
  }

  // Generic error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    type: 'InternalError',
  });
}
