FROM node:11.15.0

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm","run","start"]