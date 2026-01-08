# User CRUD API - Hexagonal Architecture Example

## 🚀 Sobre o Projeto

Este projeto é uma implementação de um CRUD (Create, Read, Update, Delete) de usuários seguindo as melhores práticas de desenvolvimento de software:

- **SOLID Principles** - Princípios de design orientado a objetos
- **Clean Code** - Código limpo e legível
- **Hexagonal Architecture (Ports and Adapters)** - Arquitetura hexagonal
- **In-Memory Database** - Banco de dados em memória
- **Cohesive and Decoupled Code** - Código coeso e desacoplado

## 📁 Estrutura do Projeto

```
src/
├── domain/                    # Camada de Domínio
│   ├── entities/             # Entidades de negócio
│   │   └── User.ts          # Entidade User com validações
│   └── errors/              # Erros de domínio
│       └── DomainErrors.ts  # Erros customizados
│
├── application/              # Camada de Aplicação
│   ├── ports/               # Interfaces (Portas)
│   │   └── UserRepository.ts # Interface do repositório
│   └── use-cases/           # Casos de uso (Regras de negócio)
│       ├── CreateUserUseCase.ts
│       ├── GetUserUseCase.ts
│       ├── ListUsersUseCase.ts
│       ├── UpdateUserUseCase.ts
│       └── DeleteUserUseCase.ts
│
├── infrastructure/           # Camada de Infraestrutura
│   ├── repositories/        # Adaptadores de persistência
│   │   └── InMemoryUserRepository.ts
│   └── http/               # Adaptador HTTP
│       ├── controllers/    # Controladores
│       ├── middlewares/    # Middlewares
│       └── routes/        # Rotas
│
├── app.ts                   # Configuração da aplicação
└── index.ts                # Entry point
```

## 🎯 Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada classe tem uma única responsabilidade
- `User` entity: gerencia dados do usuário e validações
- Use cases: cada um lida com uma operação específica
- Repository: responsável apenas pela persistência

### Open/Closed Principle (OCP)
- Classes abertas para extensão, fechadas para modificação
- Entidades podem ser estendidas sem modificar código existente
- Use cases podem ser adicionados sem alterar os existentes

### Liskov Substitution Principle (LSP)
- Implementações do `UserRepository` podem ser substituídas
- `InMemoryUserRepository` pode ser trocado por qualquer outra implementação

### Interface Segregation Principle (ISP)
- Interface `UserRepository` contém apenas métodos necessários
- Clientes não dependem de métodos que não usam

### Dependency Inversion Principle (DIP)
- Módulos de alto nível não dependem de módulos de baixo nível
- Use cases dependem da interface `UserRepository`, não da implementação
- Dependências injetadas através de construtores

## 🏗️ Arquitetura Hexagonal

### Camadas

1. **Domain (Core)**: Entidades e regras de negócio puras
2. **Application**: Casos de uso e interfaces (ports)
3. **Infrastructure**: Implementações técnicas (adapters)

### Benefícios

- ✅ Testabilidade: fácil mock de dependências
- ✅ Manutenibilidade: mudanças isoladas em camadas
- ✅ Flexibilidade: fácil troca de implementações
- ✅ Independência de frameworks: lógica de negócio isolada

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **Jest** - Framework de testes
- **ESLint** - Linter para qualidade de código

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/celfons/test-copilot.git

# Entre no diretório
cd test-copilot

# Instale as dependências
npm install
```

## 🚀 Como Executar

### Desenvolvimento
```bash
# Inicia o servidor em modo de desenvolvimento com hot reload
npm run dev
```

### Produção
```bash
# Compila o TypeScript
npm run build

# Inicia o servidor
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 🧪 Testes

```bash
# Executa todos os testes
npm test

# Executa testes em modo watch
npm run test:watch

# Executa testes com cobertura
npm run test:coverage
```

### CI/CD - Integração Contínua

O projeto inclui uma GitHub Action que executa automaticamente:

- ✅ **Linting** - Verifica qualidade do código com ESLint
- ✅ **Testes Unitários** - Executa todos os 76 testes
- ✅ **Cobertura de Código** - Gera relatório de cobertura (95.79%)
- ✅ **Build** - Compila o TypeScript para JavaScript

A Action é executada automaticamente:
- Em todos os **Pull Requests** para a branch `main`
- Em todos os **pushes** para a branch `main`

O merge para `main` só é permitido se todos os testes passarem. ✅

## 📝 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```http
GET /health
```

### Users

#### Criar Usuário
```http
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "age": 30
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "1704726000000-abc123def",
    "name": "João Silva",
    "email": "joao@example.com",
    "age": 30,
    "createdAt": "2024-01-08T12:00:00.000Z",
    "updatedAt": "2024-01-08T12:00:00.000Z"
  }
}
```

#### Listar Todos os Usuários
```http
GET /api/users
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1704726000000-abc123def",
      "name": "João Silva",
      "email": "joao@example.com",
      "age": 30,
      "createdAt": "2024-01-08T12:00:00.000Z",
      "updatedAt": "2024-01-08T12:00:00.000Z"
    }
  ]
}
```

#### Buscar Usuário por ID
```http
GET /api/users/:id
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "1704726000000-abc123def",
    "name": "João Silva",
    "email": "joao@example.com",
    "age": 30,
    "createdAt": "2024-01-08T12:00:00.000Z",
    "updatedAt": "2024-01-08T12:00:00.000Z"
  }
}
```

#### Atualizar Usuário
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "João da Silva",
  "age": 31
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "1704726000000-abc123def",
    "name": "João da Silva",
    "email": "joao@example.com",
    "age": 31,
    "createdAt": "2024-01-08T12:00:00.000Z",
    "updatedAt": "2024-01-08T12:05:00.000Z"
  }
}
```

#### Deletar Usuário
```http
DELETE /api/users/:id
```

**Response (204 No Content)**

### Códigos de Erro

- `400 Bad Request` - Dados inválidos (ValidationError)
- `404 Not Found` - Recurso não encontrado (NotFoundError)
- `409 Conflict` - Conflito (ex: email já existe) (ConflictError)
- `500 Internal Server Error` - Erro interno do servidor

## 🧹 Qualidade de Código

### Linting
```bash
# Verifica problemas no código
npm run lint

# Corrige problemas automaticamente
npm run lint:fix
```

### Práticas de Clean Code Aplicadas

1. **Nomes Significativos**: Classes, métodos e variáveis com nomes descritivos
2. **Funções Pequenas**: Cada função tem uma única responsabilidade
3. **Comentários Úteis**: Documentação onde necessário
4. **Tratamento de Erros**: Erros específicos para cada situação
5. **Evitar Duplicação**: Código DRY (Don't Repeat Yourself)
6. **Formatação Consistente**: ESLint garante padrão de código

## 🔒 Validações

O sistema valida automaticamente:

- **Nome**: Obrigatório, mínimo 2 caracteres, máximo 100 caracteres
- **Email**: Obrigatório, formato válido de email, único no sistema
- **Idade**: Obrigatório, número positivo, máximo 150

## 🎓 Conceitos Demonstrados

### Coesão
- Cada módulo tem responsabilidades bem definidas
- Entidades focadas em seu próprio domínio
- Use cases focados em operações específicas

### Desacoplamento
- Camadas independentes através de interfaces
- Inversão de dependências
- Fácil substituição de implementações

### Testabilidade
- Testes unitários para entidades
- Testes de integração para use cases
- Testes end-to-end para API

## 📚 Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

## 👨‍💻 Autor

Desenvolvido como exemplo de implementação de CRUD com as melhores práticas de desenvolvimento de software.

## 📄 Licença

ISC
