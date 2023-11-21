FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 1884
EXPOSE 8884

CMD [ "npm", "start"]