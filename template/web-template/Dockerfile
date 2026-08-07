FROM node:24.11.0-alpine AS builder
WORKDIR /usr/src/app

COPY bin ./bin
COPY packages ./packages
COPY apps/{APP_NAME} ./apps/{APP_NAME}

RUN ./bin/init apps/{APP_NAME}
RUN rm -rfv ./apps/{APP_NAME}/jest.config.ts
RUN npm run build

FROM nginx:alpine as production
ENV APP_ENV production
COPY --from=builder /usr/src/app/apps/{APP_NAME}/public /usr/share/nginx/html
COPY ./apps/{APP_NAME}/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
