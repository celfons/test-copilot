import { User } from '../../domain/entities/User';
import { UserRepository } from '../../application/ports/UserRepository';

/**
 * InMemoryUserRepository - Infrastructure Layer
 * Implements the UserRepository port with in-memory storage
 * 
 * Follows SOLID principles:
 * - SRP: Single responsibility - manages user persistence in memory
 * - DIP: Implements the UserRepository interface (adapter pattern)
 * - LSP: Can be substituted with any other UserRepository implementation
 * 
 * Clean and decoupled: no business logic here, only persistence concerns
 */
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    const user = users.find((u) => u.email === email);
    return user || null;
  }

  async update(id: string, user: User): Promise<User> {
    this.users.set(id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }

  // Utility method for testing purposes
  clear(): void {
    this.users.clear();
  }

  // Utility method to get the size of the repository
  size(): number {
    return this.users.size;
  }
}
