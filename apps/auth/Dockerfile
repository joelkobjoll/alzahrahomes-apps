# ──────────────────────────────────────────────────────────────────────────────
# Alzahra Auth Service — Multi-stage Dockerfile
# Hono-based auth microservice with graceful shutdown
# ──────────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 1 — Base
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache dumb-init
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 2 — Dependencies
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS deps
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/auth-config/package.json packages/auth-config/
COPY packages/auth-client/package.json packages/auth-client/
COPY packages/types/package.json packages/types/
COPY packages/validators/package.json packages/validators/
COPY apps/auth/package.json apps/auth/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 3 — Build
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ ./packages/
COPY apps/auth/ ./apps/auth/
# Build workspace packages + auth app
RUN pnpm --filter @alzahra/db... build \
    && pnpm --filter @alzahra/auth-config... build \
    && pnpm --filter @alzahra/auth-client... build \
    && pnpm --filter @alzahra/types... build \
    && pnpm --filter @alzahra/validators... build \
    && pnpm --filter @alzahra/auth build

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 4 — Production
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS production
ENV NODE_ENV=production
ENV PORT=4001
# Install wget for healthchecks
RUN apk add --no-cache wget
# Copy only built artifacts and prod deps
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/packages /app/packages
COPY --from=build /app/apps/auth/dist /app/apps/auth/dist
COPY --from=build /app/apps/auth/package.json /app/apps/auth/
WORKDIR /app/apps/auth
EXPOSE 4001
# Graceful shutdown via dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
