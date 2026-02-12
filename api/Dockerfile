# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base
WORKDIR /app

# -------------------------
# deps (inclui dev deps p/ build)
# -------------------------
FROM base AS deps
COPY package*.json ./
RUN npm ci

# -------------------------
# build
# -------------------------
FROM deps AS build
COPY . .
RUN npx prisma generate
RUN npm run build

# -------------------------
# prod deps (somente produção)
# -------------------------
FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev

# -------------------------
# runtime
# -------------------------
FROM base AS prod
ENV NODE_ENV=production

# Dependências de produção
COPY --from=prod-deps /app/node_modules ./node_modules

# Build output (Nest/TS -> dist)
COPY --from=build /app/dist ./dist

# Prisma schema + engines/client (se necessário)
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Metadata (opcional, ajuda em alguns runtimes)
COPY package*.json ./

# Render injeta PORT dinamicamente; seu app deve usar process.env.PORT.
# EXPOSE é informativo (não "abre" porta sozinho).
EXPOSE 3333

# Se seu build gerar dist/src/main.js em vez de dist/main.js, troque aqui.
CMD ["node", "dist/main.js"]
