FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]