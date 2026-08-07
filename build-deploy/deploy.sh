#! /usr/bin/bash

function deploy() {
  source .env
  IFS='/'
  read -ra FOUND <<< "$APP_NAME"
  DOMAIN="${FOUND[0]/@/}"
  THE_NAME="${FOUND[1]}"
  echo "$THE_NAME"
  ENV_NAME="$APP_ENV"
  if [ "$ENV_NAME" = "development" ]; then
    ENV_NAME="dev"
  fi

  STACK_ENV="${DOMAIN}-${ENV_NAME}"

  export APP_NAME="${STACK_ENV}_${THE_NAME}"

  # Deploy the stack
  docker stack deploy --with-registry-auth \
    --detach=true \
    --resolve-image=always \
    --compose-file docker-compose.yml "${STACK_ENV}"

  # Build the services
  docker compose \
    -f docker-compose.yml \
    build --progress=tty

  # Update the service
  docker service update "${STACK_ENV}_${THE_NAME}" --force
}

deploy
