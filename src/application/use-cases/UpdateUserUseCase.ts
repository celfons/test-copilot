import { User, UserProps } from '../../domain/entities/User';
import { UserRepository } from '../ports/UserRepository';
import { NotFoundError, ConflictError } from '../../domain/errors/DomainErrors';

/**
 * UpdateUser Use Case
 * Follows SOLID principles:
 * - SRP: Single responsibility - handles user update logic
 * - DIP: Depends on UserRepository abstraction
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    updateData: Partial<Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }

    // Business rule: if email is being updated, check uniqueness
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError('Email already in use by another user');
      }
    }

    user.update(updateData);
    return await this.userRepository.update(id, user);
  }
}
