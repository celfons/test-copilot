import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/DeleteUserUseCase';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { ConflictError, NotFoundError } from '../../domain/errors/DomainErrors';

describe('Use Cases', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  describe('CreateUserUseCase', () => {
    it('should create a new user', async () => {
      const useCase = new CreateUserUseCase(repository);

      const user = await useCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(30);
      expect(repository.size()).toBe(1);
    });

    it('should throw ConflictError if email already exists', async () => {
      const useCase = new CreateUserUseCase(repository);

      await useCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await expect(
        useCase.execute({
          name: 'Jane Doe',
          email: 'john@example.com',
          age: 25,
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('GetUserUseCase', () => {
    it('should get a user by id', async () => {
      const createUseCase = new CreateUserUseCase(repository);
      const getUseCase = new GetUserUseCase(repository);

      const created = await createUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const found = await getUseCase.execute(created.id);

      expect(found.id).toBe(created.id);
      expect(found.name).toBe('John Doe');
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const useCase = new GetUserUseCase(repository);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('ListUsersUseCase', () => {
    it('should list all users', async () => {
      const createUseCase = new CreateUserUseCase(repository);
      const listUseCase = new ListUsersUseCase(repository);

      await createUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await createUseCase.execute({
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 25,
      });

      const users = await listUseCase.execute();

      expect(users).toHaveLength(2);
    });

    it('should return empty array if no users', async () => {
      const useCase = new ListUsersUseCase(repository);
      const users = await useCase.execute();

      expect(users).toHaveLength(0);
    });
  });

  describe('UpdateUserUseCase', () => {
    it('should update a user', async () => {
      const createUseCase = new CreateUserUseCase(repository);
      const updateUseCase = new UpdateUserUseCase(repository);

      const created = await createUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const updated = await updateUseCase.execute(created.id, {
        name: 'Jane Doe',
        age: 25,
      });

      expect(updated.name).toBe('Jane Doe');
      expect(updated.age).toBe(25);
      expect(updated.email).toBe('john@example.com');
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const useCase = new UpdateUserUseCase(repository);

      await expect(
        useCase.execute('non-existent-id', { name: 'Jane Doe' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError if email is already in use', async () => {
      const createUseCase = new CreateUserUseCase(repository);
      const updateUseCase = new UpdateUserUseCase(repository);

      const user1 = await createUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await createUseCase.execute({
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 25,
      });

      await expect(
        updateUseCase.execute(user1.id, { email: 'jane@example.com' })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('DeleteUserUseCase', () => {
    it('should delete a user', async () => {
      const createUseCase = new CreateUserUseCase(repository);
      const deleteUseCase = new DeleteUserUseCase(repository);

      const created = await createUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await deleteUseCase.execute(created.id);

      expect(repository.size()).toBe(0);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const useCase = new DeleteUserUseCase(repository);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundError);
    });
  });
});
