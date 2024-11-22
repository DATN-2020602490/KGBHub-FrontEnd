FROM node:lts-iron AS build

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]
RUN yarn --pure-lockfile

COPY . .

RUN yarn build

EXPOSE 3001

CMD yarn next start -p 3001
