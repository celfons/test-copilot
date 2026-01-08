import express, { Express } from 'express';
import { UserController } from './infrastructure/http/controllers/UserController';
import { createUserRoutes } from './infrastructure/http/routes/userRoutes';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';
import { InMemoryUserRepository } from './infrastructure/repositories/InMemoryUserRepository';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from './application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from './application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from './application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from './application/use-cases/DeleteUserUseCase';

/**
 * Application setup - Dependency Injection Container
 * Follows SOLID principles:
 * - DIP: All dependencies are injected from the outside
 * - SRP: Each component has a single responsibility
 * 
 * This is where we wire up all dependencies (Composition Root)
 */
export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Infrastructure - Repository (can be easily swapped with another implementation)
  const userRepository = new InMemoryUserRepository();

  // Application - Use Cases (business logic)
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getUserUseCase = new GetUserUseCase(userRepository);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  // HTTP Layer - Controller
  const userController = new UserController(
    createUserUseCase,
    getUserUseCase,
    listUsersUseCase,
    updateUserUseCase,
    deleteUserUseCase
  );

  // Routes
  app.use('/api/users', createUserRoutes(userController));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  // API documentation endpoint
  app.get('/', (_req, res) => {
    res.status(200).json({
      message: 'User CRUD API - Hexagonal Architecture Example',
      endpoints: {
        health: 'GET /health',
        users: {
          create: 'POST /api/users',
          list: 'GET /api/users',
          getById: 'GET /api/users/:id',
          update: 'PUT /api/users/:id',
          delete: 'DELETE /api/users/:id',
        },
      },
      architecture: {
        pattern: 'Hexagonal Architecture',
        principles: ['SOLID', 'Clean Code', 'Cohesive and Decoupled'],
        layers: {
          domain: 'Entities and business rules',
          application: 'Use cases and ports',
          infrastructure: 'Adapters (HTTP, Repository)',
        },
      },
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
