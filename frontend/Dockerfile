FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i --production
COPY . .
RUN npm run build


FROM nginx:1.23.1-alpine AS production
WORKDIR /app
COPY --from=builder /app/build /user/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/conf.d /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
