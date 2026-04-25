# Alzahra Homes — Agent Rules & Constraints

> **Read this file first** before making any changes to this codebase.
> This document encodes the architecture, patterns, and guardrails for the Alzahra Homes platform.

---

## Architecture

- **Clean Architecture** with **Vertical Slicing**
- Each feature is a self-contained vertical slice: `domain → application → infrastructure → presentation`
- Dependencies point inward: Presentation → Infrastructure → Application → Domain
- Domain has ZERO framework dependencies

---

## Layer Import Boundaries

```
Domain → (nothing except language builtins)
Application → Domain only
Infrastructure → Application, Domain
Presentation → Infrastructure, Application, Domain
```

**Never allow:**
- Domain importing from Application, Infrastructure, or Presentation
- Application importing from Infrastructure or Presentation
- Infrastructure importing from Presentation

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `login-user.use-case.ts` |
| Classes | PascalCase | `LoginUserUseCase` |
| Interfaces | PascalCase with `I` prefix | `IUserRepository` |
| Repository implementations | Drizzle + entity name | `DrizzleUserRepository` |
| DTOs | suffix `DTO` | `LoginUserDTO` |
| Use cases | suffix `UseCase` | `CreatePropertyUseCase` |
| Route files | `feature.routes.ts` | `properties.routes.ts` |
| Enums | PascalCase | `UserRole` |
| Constants | UPPER_SNAKE_CASE | `PERMISSION_MANAGE_PROPERTIES` |

---

## Use Case Pattern

- Every use case is a class with `UseCase` suffix
- Constructor injection of repository interfaces (and other domain services)
- Single public method: `execute(input: SomeDTO): Promise<SomeResultDTO>`
- Use cases live in `application/use-cases/`
- DTOs live in `application/dto/`
- Use cases ONLY import from `domain/` and sibling DTOs

```ts
// Example
export class LoginUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}
  async execute(dto: LoginUserDTO): Promise<AuthResultDTO> { ... }
}
```

---

## Repository Pattern

- Interfaces live in `domain/repositories/`
- Implementations live in `infrastructure/repositories/`
- Domain entities are plain objects (no ORM decorators)
- Repository methods return domain entities, not ORM types
- Never expose Drizzle/sqlite/Postgres types through repository interfaces

---

## Frontend Rules

- **guest-web**: Astro. No client-side state management. Server-rendered pages.
- **admin-web**: Next.js App Router. Server Components by default.
- **NEVER put business logic in UI components** (pages, JSX, Astro components)
- Business logic belongs in use cases or server actions
- API calls go through typed SDKs (packages/auth-client, future api-client)

---

## API Rules

- Framework: **Hono**
- Route file per feature: `feature.routes.ts`
- Every response uses the envelope shape:
  ```json
  { "data": ..., "error": null }
  ```
  or on failure:
  ```json
  { "data": null, "error": { "status", "code", "message", "details?" } }
  ```
- Validation via Zod middleware
- No business logic in route handlers — delegate to use cases

---

## Auth Rules

### Guest Tokens
- Passed via `x-guest-token` header
- Used for public/guest flows (property browsing, booking inquiries)
- Stateless or short-lived

### Staff Auth
- Session-based via HTTP-only cookies
- Used for admin-web and staff operations
- NEVER mix guest tokens and staff sessions in the same request handler

### General
- `POST /login` → sets session cookie (staff)
- `POST /logout` → clears session cookie
- `POST /register` → creates user, may auto-login
- `GET /me` → returns current user based on cookie
- `POST /impersonate` → staff can impersonate guest (audit log required)

---

## Database Rules

- **Drizzle schema is the single source of truth**
- All timestamps use `timestamptz` (UTC)
- No raw SQL except for PostGIS spatial queries
- Migrations via `drizzle-kit`
- Domain entities must NOT import Drizzle types

---

## Error Handling

- Domain errors are typed classes extending `DomainError`
- Central error mapping in presentation layer (Hono middleware)
- NEVER swallow errors with empty `catch {}`
- Always map to the API error envelope

```ts
// Domain error example
export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  constructor(message = 'Unauthorized') { super(message); }
}
```

---

## Agent Never-Do List

- ❌ Put business logic in views, JSX, or page components
- ❌ Use `any` type anywhere
- ❌ Access the database directly from a use case (always through repository interface)
- ❌ Import Infrastructure into Application or Domain
- ❌ Import Presentation into Infrastructure or Application
- ❌ Mix guest-token auth with cookie-session auth in the same handler
- ❌ Write raw SQL (except PostGIS spatial queries)
- ❌ Skip validation on incoming request bodies
- ❌ Forget to write audit logs for sensitive operations (login, impersonate, delete)
- ❌ Use `console.log` for errors — use structured logging or throw typed errors

---

## Monorepo Structure

```
alzahrahomes-apps/
├── apps/
│   ├── auth/          # Auth service (Hono, Clean Architecture)
│   ├── api/           # Main API (Hono, vertical slices)
│   ├── admin-web/     # Next.js admin dashboard
│   └── guest-web/     # Astro guest-facing site
├── packages/
│   ├── auth-config/   # Roles, permissions, cookie config, Zod schemas
│   ├── auth-client/   # Typed SDK for auth, session hooks, permission helpers
│   ├── db/            # Drizzle schema, client, migrations
│   ├── types/         # Shared TS interfaces
│   ├── validators/    # Shared Zod schemas
│   ├── config/        # Shared tsconfig, eslint, prettier
│   ├── ui/            # Shared UI components
│   └── testing/       # Test utilities
```

---

## Commit & PR Hygiene

- One logical change per commit
- Feature branches for non-trivial work
- All commits must pass `pnpm typecheck` and `pnpm lint`
- Update AGENTS.md if you change architectural rules
