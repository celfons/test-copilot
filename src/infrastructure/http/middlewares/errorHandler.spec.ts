import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../infrastructure/http/middlewares/errorHandler';
import { ValidationError, NotFoundError, ConflictError, DomainError } from '../../../domain/errors/DomainErrors';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
    };
    mockNext = jest.fn();
  });

  it('should handle ValidationError with 400 status', () => {
    const error = new ValidationError('Invalid input');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Invalid input',
      type: 'ValidationError',
    });
  });

  it('should handle NotFoundError with 404 status', () => {
    const error = new NotFoundError('User', '123');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'User with id 123 not found',
      type: 'NotFoundError',
    });
  });

  it('should handle ConflictError with 409 status', () => {
    const error = new ConflictError('Email already exists');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Email already exists',
      type: 'ConflictError',
    });
  });

  it('should handle generic DomainError with 400 status', () => {
    const error = new DomainError('Some domain error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Some domain error',
      type: 'DomainError',
    });
  });

  it('should handle unknown errors with 500 status', () => {
    const error = new Error('Unexpected error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      type: 'InternalError',
    });
  });

  it('should handle TypeError with 500 status', () => {
    const error = new TypeError('Type error occurred');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      type: 'InternalError',
    });
  });
});
