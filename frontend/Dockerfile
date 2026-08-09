###############################################################################
# UniResearch Frontend – Multi-stage Dockerfile (Next.js + pnpm)
###############################################################################

# ── Base stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# ── Dependencies stage ───────────────────────────────────────────────────────
FROM base AS deps

# Copy package manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ── Development stage ────────────────────────────────────────────────────────
FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true

CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

# ── Build stage (for production) ─────────────────────────────────────────────
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ── Production stage ─────────────────────────────────────────────────────────
FROM base AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy built output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
