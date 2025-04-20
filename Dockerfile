# 🏗️ Build stage
FROM node:23-slim AS builder

WORKDIR /app

# 🧾 Copie le code et les fichiers nécessaires
COPY . .
COPY .env.production .env.production

# 🛠️ Build avec .env.production lu automatiquement
RUN yarn install --frozen-lockfile && \
    yarn build

# 🧼 Final stage - runtime only
FROM node:23-slim

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.production .env.production

RUN yarn install --production

EXPOSE 3000
CMD ["yarn", "start"]
