import { Router } from 'express';
import { UserController } from '../controllers/UserController';

/**
 * User Routes
 * RESTful API endpoints for user CRUD operations
 */
export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // Create a new user
  router.post('/', userController.create);

  // Get all users
  router.get('/', userController.list);

  // Get user by ID
  router.get('/:id', userController.getById);

  // Update user
  router.put('/:id', userController.update);

  // Delete user
  router.delete('/:id', userController.delete);

  return router;
}
