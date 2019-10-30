FROM node:8-alpine

WORKDIR /usr/src/app

COPY ./scripts ./scripts
RUN ./scripts/install_packages.sh

RUN Xvfb :1 -screen 0 800x600x24&
RUN Xvfb :99 -ac &

ENV NODE_ENV=production

COPY ./package*.json ./
RUN npm install --only=production
COPY . ./

EXPOSE 5000
EXPOSE 8000

CMD ["./scripts/node_app_entry.sh"]
