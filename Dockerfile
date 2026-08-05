# ---- Stage 1: Install dependencies with Bun ----
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# ---- Stage 2: Build TypeScript ----
FROM deps AS build
WORKDIR /app
COPY . .
RUN bun run build

# ---- Stage 3: Production runtime (Node, avoids Bun/bson crash) ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 5000
CMD ["node", "dist/server.js"]