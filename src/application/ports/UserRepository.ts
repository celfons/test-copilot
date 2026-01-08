import { User } from '../../domain/entities/User';

/**
 * UserRepository Port (Interface)
 * Follows SOLID principles:
 * - DIP: Dependency Inversion Principle - high-level modules depend on abstractions
 * - ISP: Interface Segregation Principle - focused interface with only needed methods
 * 
 * This interface defines the contract for user persistence
 * Implementation details are hidden in the infrastructure layer
 */
export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
