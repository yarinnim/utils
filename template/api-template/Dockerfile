FROM node:24.11.0-alpine
WORKDIR /usr/src/app

COPY bin ./bin
COPY packages ./packages
COPY apps/{APP_NAME} ./apps/{APP_NAME}

RUN ./bin/init apps/{APP_NAME} \
  && npm run build \
  && rm -rf node_modules \
  && npm cache verify \
  && npm cache clean --force \
  && npm install --omit=dev

EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
