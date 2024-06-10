FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i -g pm2
RUN npm i -g @nestjs/cli
RUN npm i --production
COPY . .
RUN npm run build


FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN ls /app
COPY --from=builder /app/dist ./dist/
EXPOSE 4000

CMD ["pm2-runtime", "npm", "--", "start"]
