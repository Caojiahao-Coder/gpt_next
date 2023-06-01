FROM node:latest

WORKDIR /usr/src

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install

RUN pnpm run build

RUN npm install -g http-server

EXPOSE 8080

CMD http-server dist
