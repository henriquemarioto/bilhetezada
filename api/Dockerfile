FROM node:20.20.0-alpine

WORKDIR /api

COPY package.json .

RUN npm install -g @nestjs/cli@10.2.1

RUN npm i

COPY . .

EXPOSE 3132

CMD ["npm", "run", "start:dev"]