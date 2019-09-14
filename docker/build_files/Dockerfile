FROM node:8-alpine

RUN apk update && \
    apk add vim && \
    apk add nano && \
    apk add wkhtmltopdf

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install --only=production
COPY . ./

EXPOSE 5000
EXPOSE 8000

CMD ["./scripts/node_app_entry.sh"]
