# ──────────────────────────────────────────────────────────────────────────────
# Alzahra API Service — Multi-stage Dockerfile
# Hono-based API with Clean Architecture + vertical slices
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
COPY packages/types/package.json packages/types/
COPY packages/validators/package.json packages/validators/
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 3 — Build
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN pnpm --filter @alzahra/db... build \
    && pnpm --filter @alzahra/types... build \
    && pnpm --filter @alzahra/validators... build \
    && pnpm --filter @alzahra/api build

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 4 — Production
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS production
ENV NODE_ENV=production
ENV PORT=4000
RUN apk add --no-cache wget
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/packages /app/packages
COPY --from=build /app/apps/api/dist /app/apps/api/dist
COPY --from=build /app/apps/api/package.json /app/apps/api/
WORKDIR /app/apps/api
EXPOSE 4000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
