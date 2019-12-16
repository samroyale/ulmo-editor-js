FROM node:carbon

EXPOSE 3000

WORKDIR /usr/src/client

COPY package.json ./
COPY yarn.lock ./
COPY config-overrides.js ./

RUN sed -i "s/localhost/api/" /usr/src/client/package.json

RUN ls -l /usr/src/client

RUN yarn install

CMD [ "npm", "start" ]