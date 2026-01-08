import { UserRepository } from '../ports/UserRepository';
import { NotFoundError } from '../../domain/errors/DomainErrors';

/**
 * DeleteUser Use Case
 * Follows SOLID principles:
 * - SRP: Single responsibility - handles user deletion
 * - DIP: Depends on UserRepository abstraction
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.userRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('User', id);
    }
    await this.userRepository.delete(id);
  }
}
