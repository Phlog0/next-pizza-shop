FROM node:lts-alpine AS base


# Stage 1: Install dependencies 
FROM base AS deps
WORKDIR /app
# Для компиляции bcrypt и других нативных модулей
RUN apk add --no-cache python3 make g++  
COPY package.json package-lock.json ./
# Устанавливаем всё, включая dev, чтобы собрать проект
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерация клиента НЕ ТРЕБУЕТ БД — оставляем здесь
RUN npx prisma generate
RUN cd prisma && npx tsc
RUN npm run build


# Stage 3: Production server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Устанавливаем утилиты для проверки БД
RUN apk add --no-cache postgresql-client
# Копируем скрипт и делаем его исполняемым
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN mkdir -p ./prisma

COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations
COPY --from=builder /app/prisma/dist ./prisma/dist
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]