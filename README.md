# Alzahra Homes Platform

A modern hospitality management platform built as a Turborepo monorepo.

## Overview

Alzahra Homes is a comprehensive hospitality platform designed to manage guest experiences, property administration, authentication, and API services under a unified architecture.

## Repository Structure

This monorepo is organized using [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces).

```
alzahrahomes-apps/
├── apps/
│   ├── guest-web/      # Guest-facing web application
│   ├── admin-web/      # Admin dashboard web application
│   ├── api/            # Backend API service
│   └── auth/           # Authentication service
├── packages/
│   ├── ui/             # Shared UI component library
│   ├── auth-client/    # Authentication client utilities
│   ├── auth-config/    # Authentication configuration
│   ├── db/             # Database schema and client
│   ├── validators/     # Shared validation schemas
│   ├── types/          # Shared TypeScript types
│   ├── config/         # Shared configuration presets
│   └── testing/        # Shared testing utilities
├── .github/workflows/  # CI/CD workflows
├── package.json        # Root workspace configuration
├── pnpm-workspace.yaml # pnpm workspace definition
└── turbo.json          # Turborepo pipeline configuration
```

## Apps

### `guest-web`
The public-facing web application where guests can browse properties, make bookings, and manage their reservations.

### `admin-web`
The internal administration dashboard for property managers. Provides tools for managing listings, bookings, guests, and analytics.

### `api`
The core backend API that powers both guest-web and admin-web. Handles business logic, data persistence, and external integrations.

### `auth`
Standalone authentication service responsible for user identity, sessions, SSO, and token management.

## Packages

### `ui`
Reusable React component library with design system tokens. Shared across `guest-web` and `admin-web`.

### `auth-client`
Authentication client SDK used by frontend apps to interact with the `auth` service.

### `auth-config`
Shared authentication configuration, constants, and environment schemas.

### `db`
Database schema definitions, migrations, and shared Prisma/client utilities.

### `validators`
Shared validation schemas using Zod (or similar) for input validation across API and frontend forms.

### `types`
Shared TypeScript type definitions used across the monorepo.

### `config`
Shared tooling configurations (ESLint, Prettier, TypeScript presets) to ensure consistency.

### `testing`
Shared testing utilities, mocks, fixtures, and helpers for unit and integration tests.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/joelkobjoll/alzahrahomes-apps.git
cd alzahrahomes-apps

# Install dependencies
pnpm install
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Build all apps and packages
pnpm build

# Run lint across the monorepo
pnpm lint

# Run tests across the monorepo
pnpm test
```

## CI/CD

This repository uses GitHub Actions for continuous integration. On every pull request and push to `main`, the following checks run:

- **Lint** — ESLint and Prettier checks
- **Type Check** — TypeScript compilation checks
- **Test** — Unit and integration tests
- **Build** — Production build verification

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: React / Next.js / TypeScript
- **Backend**: Node.js / TypeScript
- **Styling**: Tailwind CSS (planned)
- **Database**: PostgreSQL with Prisma (planned)
- **Authentication**: OAuth 2.0 / OpenID Connect (planned)
- **Testing**: Vitest + Playwright (planned)
- **CI/CD**: GitHub Actions

## License

Private — All rights reserved.
