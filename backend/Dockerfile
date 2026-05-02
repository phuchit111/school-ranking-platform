FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache wget openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
EXPOSE 3005
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node src/server.js"]
