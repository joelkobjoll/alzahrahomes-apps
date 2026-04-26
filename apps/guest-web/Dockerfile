# ──────────────────────────────────────────────────────────────────────────────
# Alzahra Guest Web — Multi-stage Dockerfile
# Astro static build served by nginx
# ──────────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 1 — Base
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:${NODE_VERSION}-alpine AS base
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
COPY apps/guest-web/package.json apps/guest-web/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 3 — Build
# ═══════════════════════════════════════════════════════════════════════════════
FROM base AS build
# Accept build-time env vars
ARG API_URL
ARG AUTH_URL
ARG NODE_ENV=production
ENV API_URL=${API_URL}
ENV AUTH_URL=${AUTH_URL}
ENV NODE_ENV=${NODE_ENV}
COPY --from=deps /app/node_modules /app/node_modules
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ ./packages/
COPY apps/guest-web/ ./apps/guest-web/
RUN pnpm --filter @alzahra/types... build \
    && pnpm --filter @alzahra/ui... build \
    && pnpm --filter @alzahra/validators... build \
    && pnpm --filter @alzahra/guest-web build

# ═══════════════════════════════════════════════════════════════════════════════
# Stage 4 — Production (nginx)
# ═══════════════════════════════════════════════════════════════════════════════
FROM nginx:1.27-alpine AS production
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
# Copy custom nginx config
COPY apps/guest-web/nginx.conf /etc/nginx/conf.d/default.conf
# Copy static build output
COPY --from=build /app/apps/guest-web/dist /usr/share/nginx/html
# Add healthcheck endpoint
RUN echo '{"status":"ok"}' > /usr/share/nginx/html/health
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
