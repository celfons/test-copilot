import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../../infrastructure/http/controllers/UserController';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUserUseCase';
import { User } from '../../../domain/entities/User';
import { NotFoundError } from '../../../domain/errors/DomainErrors';

describe('UserController', () => {
  let controller: UserController;
  let mockCreateUseCase: jest.Mocked<CreateUserUseCase>;
  let mockGetUseCase: jest.Mocked<GetUserUseCase>;
  let mockListUseCase: jest.Mocked<ListUsersUseCase>;
  let mockUpdateUseCase: jest.Mocked<UpdateUserUseCase>;
  let mockDeleteUseCase: jest.Mocked<DeleteUserUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    mockCreateUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateUserUseCase>;

    mockGetUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetUserUseCase>;

    mockListUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListUsersUseCase>;

    mockUpdateUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateUserUseCase>;

    mockDeleteUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteUserUseCase>;

    controller = new UserController(
      mockCreateUseCase,
      mockGetUseCase,
      mockListUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase
    );

    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: statusMock,
    };

    mockNext = jest.fn();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', age: 30 };
      const user = new User(userData);
      mockCreateUseCase.execute.mockResolvedValue(user);
      mockRequest.body = userData;

      await controller.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(userData);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: user.toJSON(),
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Creation failed');
      mockCreateUseCase.execute.mockRejectedValue(error);
      mockRequest.body = { name: 'John', email: 'john@example.com', age: 30 };

      await controller.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should get a user by id successfully', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      mockGetUseCase.execute.mockResolvedValue(user);
      mockRequest.params = { id: user.id };

      await controller.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockGetUseCase.execute).toHaveBeenCalledWith(user.id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: user.toJSON(),
      });
    });

    it('should call next with error when user not found', async () => {
      const error = new NotFoundError('User', '123');
      mockGetUseCase.execute.mockRejectedValue(error);
      mockRequest.params = { id: '123' };

      await controller.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('list', () => {
    it('should list all users successfully', async () => {
      const users = [
        new User({ name: 'John', email: 'john@example.com', age: 30 }),
        new User({ name: 'Jane', email: 'jane@example.com', age: 25 }),
      ];
      mockListUseCase.execute.mockResolvedValue(users);

      await controller.list(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockListUseCase.execute).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: users.map((u) => u.toJSON()),
      });
    });

    it('should return empty array when no users exist', async () => {
      mockListUseCase.execute.mockResolvedValue([]);

      await controller.list(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: [],
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('List failed');
      mockListUseCase.execute.mockRejectedValue(error);

      await controller.list(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      const updateData = { name: 'Jane Doe', age: 31 };
      mockUpdateUseCase.execute.mockResolvedValue(user);
      mockRequest.params = { id: user.id };
      mockRequest.body = updateData;

      await controller.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith(user.id, updateData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: user.toJSON(),
      });
    });

    it('should call next with error on failure', async () => {
      const error = new NotFoundError('User', '123');
      mockUpdateUseCase.execute.mockRejectedValue(error);
      mockRequest.params = { id: '123' };
      mockRequest.body = { name: 'New Name' };

      await controller.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      mockDeleteUseCase.execute.mockResolvedValue();
      mockRequest.params = { id: '123' };

      await controller.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new NotFoundError('User', '123');
      mockDeleteUseCase.execute.mockRejectedValue(error);
      mockRequest.params = { id: '123' };

      await controller.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
