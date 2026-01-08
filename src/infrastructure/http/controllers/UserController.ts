import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUserUseCase';

/**
 * UserController - HTTP Adapter
 * Follows SOLID principles:
 * - SRP: Handles HTTP requests/responses for user operations
 * - DIP: Depends on use case abstractions, not implementations
 * 
 * Clean code: thin controller, delegates business logic to use cases
 */
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, age } = req.body;
      const user = await this.createUserUseCase.execute({ name, email, age });
      res.status(201).json({
        status: 'success',
        data: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      res.status(200).json({
        status: 'success',
        data: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.listUsersUseCase.execute();
      res.status(200).json({
        status: 'success',
        data: users.map((user) => user.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = await this.updateUserUseCase.execute(id, updateData);
      res.status(200).json({
        status: 'success',
        data: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
