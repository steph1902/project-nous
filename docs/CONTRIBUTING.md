# Contributing to AgentOps

## Setup

1. Clone repo
2. `pnpm install`
3. `pnpm dev:infra` (starts Postgres, Redis, MinIO)
4. Copy `.env.example` to `.env.local` and fill values
5. `pnpm db:migrate:dev`
6. `pnpm db:seed`
7. `pnpm dev` (starts all apps)

## Development Rules

### TDD - Test Driven Development
- Write failing test first, then implement, then refactor
- Every feature must have tests before implementation

### DDD - Domain Driven Design
- Domain logic in `domain/` folders
- No infrastructure imports in domain layer
- Use ubiquitous language from PRD

### Clean Code
- Small, focused functions and classes
- Single Responsibility Principle
- Dependency Injection via ports/adapters

### Commits
Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

### Feature IDs
Reference feature IDs in commits/PRs:
- `feat(IAM-01): add user registration`
- `fix(WFC-06): handle empty DAG validation`

## Project Structure

```
apps/api/src/modules/
  {module-name}/
    domain/
      entities/      # Domain entities
      value-objects/ # Value objects
      services/      # Domain services
      errors/        # Domain errors
    application/
      commands/      # Write operations
      queries/       # Read operations
      use-cases/     # Application services
      ports/         # Interfaces
    infrastructure/
      persistence/   # Repositories
      controllers/   # HTTP endpoints
      mappers/       # Data mappers
```

## Definition of Done

A feature is NOT done unless:
- [ ] Domain rules encoded + unit-tested
- [ ] Use case tests exist (happy path + key failures)
- [ ] Integration tests added if DB/Redis/queue involved
- [ ] Naming matches ubiquitous language
- [ ] Ports/adapters respected (domain doesn't import infra)
- [ ] Observability added where relevant (audit event, logs with IDs)
- [ ] No skipped tests; CI green
- [ ] OpenAPI docs updated (if API changes)

## Running Tests

```bash
# All tests
pnpm test

# Unit tests only
pnpm test:unit

# Integration tests only
pnpm test:integration

# E2E tests
pnpm test:e2e

# With coverage
pnpm test -- --coverage
```

## Database Migrations

```bash
# Create new migration
pnpm --filter @agentops/api db:migrate:dev --name my_migration

# Apply migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## Code Style

- ESLint + Prettier configured
- Run `pnpm lint` before committing
- TypeScript strict mode enabled

## Questions?

Open an issue or reach out to the team.
