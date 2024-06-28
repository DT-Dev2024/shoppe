FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=false
COPY . .
RUN yarn build

WORKDIR /app
COPY . .

FROM nginx:1.15.2-alpine
COPY --from=builder /app/build /var/www
COPY --from=builder /app/.deploy/nginx/default.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
