FROM node:20.14.0

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN npx prisma generate


EXPOSE 3000

CMD ["yarn", "start"]