FROM node:14 AS development
# ENV NODE_ENV=development
WORKDIR /usr/ins/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:14 as production
 
EXPOSE 3001

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/ins/app

COPY --from=development /usr/ins/app .

CMD [ "node", "dist/index.js" ]
