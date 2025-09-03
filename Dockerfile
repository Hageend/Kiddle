# Imagen oficial de Bun
FROM oven/bun:1

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY bun.lock package.json ./

# Instalar dependencias
RUN bun install

# Copiar el resto del código
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando por defecto (modo dev con hot reload)
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]
