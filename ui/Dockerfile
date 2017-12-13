FROM node:carbon

EXPOSE 3000

WORKDIR /usr/src/client

COPY package.json ./

RUN sed -i "s/localhost/api/" /usr/src/client/package.json

RUN npm install

CMD [ "npm", "start" ]