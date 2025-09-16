# --- ETAPA 1: Builder ---
# En esta etapa instalamos todas las dependencias (de desarrollo y producción),
# generamos el cliente de Prisma, corremos las migraciones y construimos el frontend.
FROM oven/bun:1 AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# --- Dependencias del Servidor ---
COPY server/package.json server/bun.lockb ./server/
# Instalamos las dependencias del servidor
RUN cd server && bun install --frozen-lockfile

# --- Dependencias del Cliente ---
# Hacemos lo mismo para el cliente
COPY client/package.json client/bun.lockb ./client/
# Instalamos las dependencias del cliente
RUN cd client && bun install --frozen-lockfile

# --- Código Fuente y Build ---
# Copiamos el resto del código fuente del servidor y cliente
COPY server/ ./server/
COPY client/ ./client/

# Define un argumento para la URL de la base de datos que se pasará durante la compilación
ARG DATABASE_URL
# Establece la variable de entorno para que los comandos de Prisma puedan usarla
ENV DATABASE_URL=$DATABASE_URL

# Ejecutamos los comandos de Prisma desde la carpeta del servidor
RUN cd server && bun prisma generate
RUN cd server && bun prisma migrate dev --name initial-migration

# Construimos la aplicación del cliente para producción
RUN cd client && bun run build

# --- ETAPA 2: Producción ---
# Esta es la etapa final. Creamos una imagen limpia y ligera solo con lo necesario.
FROM oven/bun:1 AS production

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos solo las dependencias de producción del servidor desde la etapa 'builder'
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/bun.lockb ./server/

# Copiamos el cliente de Prisma ya generado
COPY --from=builder /app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY --from=builder /app/server/prisma ./server/prisma

# Copiamos el código del servidor (si usas un build, copia la carpeta 'dist')
COPY --from=builder /app/server/src ./server/src

# Copiamos el build del cliente
COPY --from=builder /app/client/dist ./client/dist

# Exponemos el puerto en el que correrá tu servidor (ajusta si es otro)
EXPOSE 3000

# El comando final para iniciar el servidor en producción
CMD ["bun", "run", "test"]