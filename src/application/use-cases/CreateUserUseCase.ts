import { User, UserProps } from '../../domain/entities/User';
import { UserRepository } from '../ports/UserRepository';
import { ConflictError } from '../../domain/errors/DomainErrors';

/**
 * CreateUser Use Case
 * Follows SOLID principles:
 * - SRP: Single responsibility - handles user creation logic
 * - DIP: Depends on UserRepository abstraction, not concrete implementation
 * 
 * Clean and cohesive: focused on one business operation
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Business rule: email must be unique
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const user = new User(userData);
    return await this.userRepository.create(user);
  }
}
