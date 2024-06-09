FROM node:16-alpine AS builder
COPY package*.json ./
RUN npm run ci --only=prod
COPY . .
RUN npm run build


FROM nginx:1.12.1-alpine
WORKDIR /app
COPY --from=builder /app/build /user/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
