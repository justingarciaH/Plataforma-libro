# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Build de Next.js
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Establecer entorno de producción antes de instalar deps
ENV NODE_ENV=production

# Copiar solo lo necesario desde builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Exponer puerto
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]
