# Etapa 1: Build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y bash
RUN node --version && npm --version
RUN npm install && npm run ng build -- --configuration production --project SportBuddiesApp-Fe

# Etapa 2: Producción (imagen mínima, solo los archivos estáticos)
FROM alpine:latest AS production
WORKDIR /app
COPY --from=build /app/dist/sport-buddies-app-fe /app/dist