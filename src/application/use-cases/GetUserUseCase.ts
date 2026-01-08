import { User } from '../../domain/entities/User';
import { UserRepository } from '../ports/UserRepository';
import { NotFoundError } from '../../domain/errors/DomainErrors';

/**
 * GetUser Use Case
 * Follows SOLID principles:
 * - SRP: Single responsibility - retrieves a user by ID
 * - DIP: Depends on UserRepository abstraction
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    return user;
  }
}
