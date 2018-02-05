FROM node:8

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install
RUN npm install --global nodemon

COPY . /app