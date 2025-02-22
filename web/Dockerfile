FROM node:20.12.0-alpine

WORKDIR /web

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]