FROM node:carbon

EXPOSE 8081

WORKDIR /usr/src/server

COPY package.json ./
COPY server.js ./
COPY app ./app

RUN npm install

CMD [ "npm", "start" ]