FROM node:12-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production
COPY . ./

EXPOSE 8000

CMD ["node", "index.js"]