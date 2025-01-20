# Etapa 1: Build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y bash
RUN node --version && npm --version  # Verifica las versiones aquí
RUN npm install && npm run ng build -- --configuration production --project SportBuddiesApp-Fe

# Etapa 2: Producción
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/sport-buddies-app-fe .
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /ssl/cert.pem /etc/nginx/
COPY /ssl/key.pem /etc/nginx/