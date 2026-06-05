FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/eslint/package.json ./tooling/eslint/
RUN bun install --frozen-lockfile

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source (Bun runs TS directly, no build step)
COPY package.json ./
COPY tooling/typescript ./tooling/typescript
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/db/src ./packages/db/src
COPY packages/db/package.json ./packages/db/
COPY packages/db/tsconfig.json ./packages/db/
COPY packages/db/drizzle.config.ts ./packages/db/
COPY packages/api/src ./packages/api/src
COPY packages/api/package.json ./packages/api/
COPY packages/api/tsconfig.json ./packages/api/

# HTTP server
EXPOSE 3000
# WebSocket sync server
EXPOSE 3001

CMD ["bun", "run", "packages/api/src/index.ts"]
