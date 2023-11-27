FROM node:20.10.0

WORKDIR /api

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start:dev"]