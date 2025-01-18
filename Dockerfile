# Etapa 1: Construcción (con Node.js)
FROM node:18 AS build

WORKDIR /app

# Copiar los archivos de configuración (package.json, etc.)
COPY . .

# Instalar dependencias
RUN npm i && npx run ng build

# En el caso de no ejecutar el npx ng build podemos instalar angular para tenerlo dentro del contenedor y reconozca el comando ng build
#RUN npm install -g @angular/cli

# Ejecutar el build de producción - npx para ejecutar ng build
#RUN npx ng build --configuration production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Copia los archivos generados de Angular al contenedor
#COPY dist/sport-buddies-app-fe /usr/share/nginx/html
COPY --from=build /app/dist/sport-buddies-app-fe .

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]