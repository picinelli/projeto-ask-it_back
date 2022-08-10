FROM node

WORKDIR /usr/src

COPY . .

RUN npm i

EXPOSE 5000

CMD [ "npm", "start" ]