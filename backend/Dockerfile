FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i && npm i -g pm2 @nestjs/cli @nestjs/common
COPY . .
RUN npm run build


FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json ./
RUN npm i && npm i -g pm2 @nestjs/cli @nestjs/common
COPY --from=builder /app/dist ./dist/
COPY ./ecosystem.config.js ./

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
