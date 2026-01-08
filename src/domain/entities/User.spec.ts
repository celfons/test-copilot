import { User } from '../../domain/entities/User';
import { ValidationError } from '../../domain/errors/DomainErrors';

describe('User Entity', () => {
  describe('Creation', () => {
    it('should create a valid user', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(30);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid name', () => {
      expect(() => {
        new User({
          name: '',
          email: 'john@example.com',
          age: 30,
        });
      }).toThrow(ValidationError);
    });

    it('should throw error for short name', () => {
      expect(() => {
        new User({
          name: 'J',
          email: 'john@example.com',
          age: 30,
        });
      }).toThrow('Name must have at least 2 characters');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: 'invalid-email',
          age: 30,
        });
      }).toThrow('Invalid email format');
    });

    it('should throw error for negative age', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: 'john@example.com',
          age: -1,
        });
      }).toThrow('Age must be a positive number');
    });

    it('should throw error for age over 150', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: 'john@example.com',
          age: 151,
        });
      }).toThrow('Age must be less than 150');
    });
  });

  describe('Update', () => {
    it('should update user name', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const oldUpdatedAt = user.updatedAt;
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      user.updateName('Jane Doe');

      expect(user.name).toBe('Jane Doe');
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update user email', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      user.updateEmail('jane@example.com');
      expect(user.email).toBe('jane@example.com');
    });

    it('should update user age', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      user.updateAge(31);
      expect(user.age).toBe(31);
    });

    it('should update multiple fields', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      user.update({
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 25,
      });

      expect(user.name).toBe('Jane Doe');
      expect(user.email).toBe('jane@example.com');
      expect(user.age).toBe(25);
    });

    it('should throw error when updating to invalid name', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      expect(() => {
        user.updateName('');
      }).toThrow(ValidationError);
    });
  });

  describe('Serialization', () => {
    it('should convert to JSON', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const json = user.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('name', 'John Doe');
      expect(json).toHaveProperty('email', 'john@example.com');
      expect(json).toHaveProperty('age', 30);
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });

    it('should create from JSON', () => {
      const data = {
        id: 'test-id',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const user = User.fromJSON(data);

      expect(user.id).toBe('test-id');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(30);
    });
  });
});
