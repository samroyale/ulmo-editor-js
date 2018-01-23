FROM node:carbon

EXPOSE 8081

WORKDIR /usr/src/server

COPY package.json ./
COPY yarn.lock ./
COPY server.js ./
COPY app ./app

RUN yarn install

CMD [ "npm", "start" ]