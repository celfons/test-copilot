import { User } from '../../domain/entities/User';
import { UserRepository } from '../ports/UserRepository';

/**
 * ListUsers Use Case
 * Follows SOLID principles:
 * - SRP: Single responsibility - retrieves all users
 * - DIP: Depends on UserRepository abstraction
 */
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
