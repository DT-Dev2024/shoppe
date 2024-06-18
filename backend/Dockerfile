FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN yarn

RUN npx prisma generate

COPY . .

CMD ["yarn", "start"]