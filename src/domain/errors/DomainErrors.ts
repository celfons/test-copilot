// Domain errors for better error handling and following SOLID principles (SRP)
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
