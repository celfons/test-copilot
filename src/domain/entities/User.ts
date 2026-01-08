import { ValidationError } from '../errors/DomainErrors';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User Entity - Domain Layer
 * Follows SOLID principles:
 * - SRP: Single responsibility - manages user data and validation
 * - OCP: Open for extension (can be extended), closed for modification
 * 
 * Clean Code principles:
 * - Meaningful names
 * - Small functions with single purpose
 * - Clear validation rules
 */
export class User {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _age: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id || this.generateId();
    this._name = props.name;
    this._email = props.email;
    this._age = props.age;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  // Getters follow encapsulation principle
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get age(): number {
    return this._age;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  updateName(name: string): void {
    this.validateName(name);
    this._name = name;
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this.validateEmail(email);
    this._email = email;
    this._updatedAt = new Date();
  }

  updateAge(age: number): void {
    this.validateAge(age);
    this._age = age;
    this._updatedAt = new Date();
  }

  // Update multiple fields at once
  update(props: Partial<Omit<UserProps, 'id' | 'createdAt'>>): void {
    if (props.name !== undefined) {
      this.updateName(props.name);
    }
    if (props.email !== undefined) {
      this.updateEmail(props.email);
    }
    if (props.age !== undefined) {
      this.updateAge(props.age);
    }
  }

  // Validation methods - cohesive and focused
  private validate(): void {
    this.validateName(this._name);
    this.validateEmail(this._email);
    this.validateAge(this._age);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }
    if (name.length < 2) {
      throw new ValidationError('Name must have at least 2 characters');
    }
    if (name.length > 100) {
      throw new ValidationError('Name must have at most 100 characters');
    }
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  private validateAge(age: number): void {
    if (age === undefined || age === null) {
      throw new ValidationError('Age is required');
    }
    if (age < 0) {
      throw new ValidationError('Age must be a positive number');
    }
    if (age > 150) {
      throw new ValidationError('Age must be less than 150');
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Convert to plain object for serialization
  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      age: this._age,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // Factory method to create from plain object
  static fromJSON(data: Record<string, unknown>): User {
    return new User({
      id: data.id as string,
      name: data.name as string,
      email: data.email as string,
      age: data.age as number,
      createdAt: data.createdAt ? new Date(data.createdAt as string) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt as string) : undefined,
    });
  }
}
