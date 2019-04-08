FROM node:11

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ADD . .
