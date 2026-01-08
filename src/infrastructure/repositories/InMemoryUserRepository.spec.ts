import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { User } from '../../domain/entities/User';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  describe('create', () => {
    it('should create and store a user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const created = await repository.create(user);

      expect(created).toBe(user);
      expect(repository.size()).toBe(1);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await repository.create(user);
      const found = await repository.findById(user.id);

      expect(found).toBe(user);
    });

    it('should return null if user not found', async () => {
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await repository.create(user);
      const found = await repository.findByEmail('john@example.com');

      expect(found).toBe(user);
    });

    it('should return null if user not found', async () => {
      const found = await repository.findByEmail('nonexistent@example.com');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const user1 = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const user2 = new User({
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 25,
      });

      await repository.create(user1);
      await repository.create(user2);

      const users = await repository.findAll();

      expect(users).toHaveLength(2);
      expect(users).toContain(user1);
      expect(users).toContain(user2);
    });

    it('should return empty array if no users', async () => {
      const users = await repository.findAll();
      expect(users).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await repository.create(user);
      user.updateName('Jane Doe');
      await repository.update(user.id, user);

      const found = await repository.findById(user.id);
      expect(found?.name).toBe('Jane Doe');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await repository.create(user);
      expect(repository.size()).toBe(1);

      await repository.delete(user.id);
      expect(repository.size()).toBe(0);

      const found = await repository.findById(user.id);
      expect(found).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      await repository.create(user);
      const exists = await repository.exists(user.id);

      expect(exists).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const exists = await repository.exists('non-existent-id');
      expect(exists).toBe(false);
    });
  });
});
