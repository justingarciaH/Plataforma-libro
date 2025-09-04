# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build de Next.js
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar solo lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Instalar solo dependencias de producción
RUN npm install --production --frozen-lockfile

EXPOSE 3000
CMD ["npm", "start"]
