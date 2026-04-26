# ──────────────────────────────────────────────────────────────────────────────
# Alzahra Admin Web — Multi-stage Dockerfile
# Next.js standalone output for minimal production image
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
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/
COPY packages/validators/package.json packages/validators/
COPY apps/admin-web/package.json apps/admin-web/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 3 — Build
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS build
ARG API_URL
ARG AUTH_URL
ARG NODE_ENV=production
ENV API_URL=${API_URL}
ENV AUTH_URL=${AUTH_URL}
ENV NODE_ENV=${NODE_ENV}
COPY --from=deps /app/node_modules /app/node_modules
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ ./packages/
COPY apps/admin-web/ ./apps/admin-web/
RUN pnpm --filter @alzahra/types... build \
    && pnpm --filter @alzahra/ui... build \
    && pnpm --filter @alzahra/validators... build \
    && pnpm --filter @alzahra/admin-web build

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 4 — Production
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000
RUN apk add --no-cache wget
# Next.js standalone output contains its own server.js + minimal node_modules
COPY --from=build /app/apps/admin-web/.next/standalone /app/
COPY --from=build /app/apps/admin-web/.next/static /app/apps/admin-web/.next/static
COPY --from=build /app/apps/admin-web/public /app/apps/admin-web/public
WORKDIR /app/apps/admin-web
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
