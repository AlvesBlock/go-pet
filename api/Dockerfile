# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base
WORKDIR /app

# -------------------------
# deps (com dev deps p/ build)
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

# DEBUG: imprime estrutura do dist no log do Render
RUN echo "==== DIST TREE (top 4 levels) ====" \
 && (find dist -maxdepth 4 -type f -print || true) \
 && echo "==== LOOKING FOR ENTRYPOINTS ====" \
 && (find dist -maxdepth 6 -type f \( -name "main.js" -o -name "index.js" \) -print || true)

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
ENV PORT=3333

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY package*.json ./

EXPOSE 3333

# Start "inteligente": tenta os caminhos mais comuns do Nest
CMD ["sh","-lc", "\
  set -e; \
  for f in dist/main.js dist/src/main.js dist/apps/api/main.js dist/apps/go-pet-api/main.js; do \
    if [ -f \"$f\" ]; then \
      echo \"Starting: node $f\"; \
      exec node \"$f\"; \
    fi; \
  done; \
  echo \"ERROR: entrypoint não encontrado. Mostrando dist/ para diagnóstico:\"; \
  find dist -maxdepth 6 -type f -print || true; \
  exit 1; \
"]
