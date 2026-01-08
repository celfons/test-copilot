# Architecture Documentation

## Overview

This project implements a User CRUD API following **Hexagonal Architecture** (also known as Ports and Adapters Architecture), applying **SOLID principles** and **Clean Code** practices.

## Hexagonal Architecture

### Core Concept

The application is organized in three main layers, with dependencies pointing inward:

```
┌─────────────────────────────────────────────────────────┐
│                    Infrastructure                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │              Application Layer                    │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │           Domain Layer                      │ │ │
│  │  │    (Entities, Business Rules)              │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │            (Use Cases, Ports)                    │ │
│  └───────────────────────────────────────────────────┘ │
│         (Adapters: HTTP, Database)                     │
└─────────────────────────────────────────────────────────┘
```

### Layer Description

#### 1. Domain Layer (Core)
**Location**: `src/domain/`

- **Entities** (`entities/`): Core business objects with validation
  - `User.ts`: User entity with business rules and validations
  
- **Errors** (`errors/`): Domain-specific errors
  - `DomainErrors.ts`: Custom error classes

**Characteristics**:
- No external dependencies
- Pure business logic
- Framework-agnostic
- Highly testable

#### 2. Application Layer
**Location**: `src/application/`

- **Ports** (`ports/`): Interfaces defining contracts
  - `UserRepository.ts`: Repository interface (port)
  
- **Use Cases** (`use-cases/`): Application business logic
  - `CreateUserUseCase.ts`: Create user operation
  - `GetUserUseCase.ts`: Retrieve single user
  - `ListUsersUseCase.ts`: Retrieve all users
  - `UpdateUserUseCase.ts`: Update user operation
  - `DeleteUserUseCase.ts`: Delete user operation

**Characteristics**:
- Orchestrates domain objects
- Depends only on domain and ports (interfaces)
- Framework-agnostic
- Contains application-specific business rules

#### 3. Infrastructure Layer (Adapters)
**Location**: `src/infrastructure/`

- **Repositories** (`repositories/`): Persistence adapters
  - `InMemoryUserRepository.ts`: In-memory implementation of UserRepository
  
- **HTTP** (`http/`): Web framework adapters
  - `controllers/`: HTTP controllers
  - `routes/`: Route definitions
  - `middlewares/`: Express middlewares

**Characteristics**:
- Implements ports defined in application layer
- Contains framework-specific code
- Can be easily replaced with other implementations

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
Each class/module has one reason to change:

- **User Entity**: Manages user data and validation only
- **Each Use Case**: Handles one specific operation
- **UserRepository**: Responsible only for persistence
- **UserController**: Handles only HTTP request/response mapping

### Open/Closed Principle (OCP)
Open for extension, closed for modification:

- New use cases can be added without modifying existing ones
- New repository implementations can be added without changing use cases
- Entities can be extended without modifying core behavior

### Liskov Substitution Principle (LSP)
Implementations can be substituted without breaking the program:

- `InMemoryUserRepository` implements `UserRepository` interface
- Can be replaced with `PostgresUserRepository`, `MongoUserRepository`, etc.
- Use cases work with any repository implementation

### Interface Segregation Principle (ISP)
Clients should not depend on methods they don't use:

- `UserRepository` interface contains only necessary methods
- Controllers depend only on the use cases they need
- No fat interfaces with unused methods

### Dependency Inversion Principle (DIP)
High-level modules don't depend on low-level modules:

- Use cases depend on `UserRepository` interface (abstraction)
- Use cases don't depend on `InMemoryUserRepository` (concrete implementation)
- Dependencies are injected through constructors
- Application core is independent of infrastructure

## Clean Code Practices

### Meaningful Names
- Classes: `CreateUserUseCase`, `InMemoryUserRepository`
- Methods: `findByEmail()`, `updateName()`, `validateAge()`
- Variables: `userRepository`, `createUserUseCase`

### Small Functions
- Each method has a single purpose
- Functions are short and focused
- Complex operations are broken into smaller methods

### Error Handling
- Custom domain errors for different scenarios
- Proper error propagation
- Centralized error handling in middleware

### Comments
- Self-documenting code
- Comments only when necessary
- Documentation for architectural decisions

### No Code Duplication
- DRY principle applied throughout
- Shared validation logic in entities
- Reusable error classes

## Design Patterns Used

### Repository Pattern
- Abstracts data access
- Provides a collection-like interface
- Easy to swap implementations

### Dependency Injection
- Dependencies passed through constructors
- Facilitates testing and flexibility
- Implemented manually (no DI framework needed)

### Factory Method
- `User.fromJSON()` for creating entities from plain objects
- Encapsulates object creation logic

### Adapter Pattern
- HTTP controllers adapt use cases to web framework
- Repository adapts domain to persistence mechanism

## Benefits of This Architecture

### 1. Testability
- Each layer can be tested independently
- Easy to mock dependencies
- 48 tests covering all layers

### 2. Maintainability
- Changes isolated to specific layers
- Clear separation of concerns
- Easy to understand and navigate

### 3. Flexibility
- Easy to swap implementations (e.g., change database)
- Can add new features without modifying existing code
- Framework-independent core

### 4. Scalability
- Can grow without architectural changes
- Easy to add new use cases
- Clear structure for team collaboration

## Data Flow Example

### Creating a User (POST /api/users)

```
┌─────────────┐      ┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Client    │─────▶│ UserController  │─────▶│ CreateUserUseCase│─────▶│    User     │
│  (HTTP)     │      │   (Adapter)     │      │  (Application)   │      │  (Domain)   │
└─────────────┘      └─────────────────┘      └──────────────────┘      └─────────────┘
                              │                         │
                              │                         │
                              ▼                         ▼
                     ┌─────────────────┐      ┌──────────────────┐
                     │   Error Handler │      │ UserRepository   │
                     │   (Middleware)  │      │     (Port)       │
                     └─────────────────┘      └──────────────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────────┐
                                              │InMemoryUserRepository│
                                              │     (Adapter)        │
                                              └──────────────────────┘
```

### Flow Steps:

1. **HTTP Request** arrives at `UserController`
2. **Controller** extracts data and calls `CreateUserUseCase`
3. **Use Case** validates business rules (email uniqueness)
4. **Use Case** creates `User` entity (domain validation occurs)
5. **Use Case** calls `UserRepository.create()`
6. **Repository** (adapter) persists the user
7. **Response** flows back through layers
8. **Error Handler** catches any errors and formats response

## Testing Strategy

### Unit Tests
- **Domain entities**: Test validation and business logic
- **Use cases**: Test application logic with mocked repositories
- **Repositories**: Test persistence logic

### Integration Tests
- **API endpoints**: Test complete request/response cycle
- **Error handling**: Validate error responses
- **Business rules**: Ensure constraints are enforced

### Coverage
```bash
npm run test:coverage
```

All critical paths are tested, ensuring reliability and confidence in changes.

## Future Enhancements

### Potential Improvements
1. **Database**: Replace in-memory with PostgreSQL/MongoDB
2. **Authentication**: Add JWT-based authentication
3. **Validation**: Use a validation library (e.g., Joi, Zod)
4. **Logging**: Add structured logging
5. **Monitoring**: Add health checks and metrics
6. **API Documentation**: Add Swagger/OpenAPI
7. **Pagination**: Add pagination to list endpoints
8. **Filtering**: Add query parameters for filtering

### Maintaining Architecture
When adding features:
- Start with domain entities
- Define use cases
- Create/extend ports if needed
- Implement adapters
- Add tests at each layer

## Conclusion

This architecture provides a solid foundation for building maintainable, testable, and scalable applications. The separation of concerns ensures that business logic remains independent of technical details, making the codebase resilient to changes in technology and requirements.
