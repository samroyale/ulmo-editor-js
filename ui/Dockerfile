FROM node:alpine

EXPOSE 3000

WORKDIR /usr/src/client

COPY package.json ./
COPY yarn.lock ./

RUN sed -i "s/localhost/api/" /usr/src/client/package.json

RUN ls -l /usr/src/client

RUN yarn install

CMD [ "yarn", "start" ]