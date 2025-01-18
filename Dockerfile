# Etapa 1: Construcción (con Node.js)
FROM node:18 AS build
# Establecer directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración (package.json, etc.)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Ejecutar el build de producción
#RUN npm run build 
RUN ng build --configuration production
#--configuration production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia los archivos generados de Angular al contenedor
COPY dist/sport-buddies-app-fe /usr/share/nginx/html


EXPOSE 4200

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
