# Etapa 1: Construcción de la aplicación
#FROM node:18 AS build
FROM node:18-alpine3.21 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY . .

# Instalar dependencias
RUN npm install
RUN npm run build

# Etapa 2: Servir la aplicación usando Nginx
FROM httpd:alpine3.21

WORKDIR /usr/local/apache2/htdocs
COPY --from=build /app/dist/sport-buddies-app-fe .