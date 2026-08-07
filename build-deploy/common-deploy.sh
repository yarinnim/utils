#! /usr/bin/bash

source ../../bin/build-deploy/common.sh
set -e

PRE_PROD_PREFIX=pre-prod
SKIP_PROD_VERIFICATION=no
DOCKER_COMPOSE_BASE_FILE=../../bin/build-deploy/docker-compose/docker-compose_deploy_base.yml
DOCKER_COMPOSE_DEPLOY_FILE=docker-compose_deploy.yml
DOCKER_COMPOSE_FILE=docker-compose.yml
TOUCHED_DOCKER_COMPOSE_BASE_FILE=docker-compose_base.yml
DOCKER_COMPOSE_PRE_PROD_FILE="${DOCKER_COMPOSE_FILE}_${PRE_PROD_PREFIX}"

# When in the production mode, it's serious to make sure that all the configuration
# and connectivities are configured properly. So, when you defined the env
# as production, you are asked to confirm if you are really
# sure to deploy in production or not. If not, this will deploy
# the image into pre-production mode.
function validate_deployment_prod() {
  generate_deployment_file
  if [ "${APP_ENV}" != "prod" ]; then return; fi

  echo "[INFO] Production deployment"
  echo "[INFO] Verifying pre-production stage"
  if [ "${SKIP_PROD_VERIFICATION}" = "yes" ]; then
    echo "[WARN] The production verification is as 'SKIPPED'."
    echo ""
    read -p "Are you sure to skip? [yes|no]: " SKIP_PROD_VERIFICATION
  fi

  if [ "${SKIP_PROD_VERIFICATION}" = "yes" ]; then return; fi

  PREVIOUS_APPLICATION_NAME="${APPLICATION_NAME}"
  APPLICATION_NAME+="_${PRE_PROD_PREFIX}"
  SERVICE_NAME+="_${PRE_PROD_PREFIX}"

  cat "${DOCKER_COMPOSE_FILE}" \
    | sed -s "s/ ${PREVIOUS_APPLICATION_NAME}/ ${APPLICATION_NAME}/g" \
    > tmp.yml

  cat tmp.yml > "${DOCKER_COMPOSE_FILE}"
  rm -f tmp.yml
}

# Display helper function for pre-prod deployment.
# Pre-Prod desployment is really important as we need to make
# sure the deployment will not be crashed by some configuration.
function show_deployment_help() {
  echo -e "Deploy the built image from registry\n"
  printf "Syntax: ./pull-deploy.sh [OPTIONS]\n"

  echo "Options:"
  echo "-h                      Print the help"
  echo "-v APP_VERSION_NUMBER   Overwrite the app version"
  echo "-b APP_BUILD_NUMBER     Overwrite the app build number"
  echo "-e APP_ENV              Overwite the App Env"
  echo "-s yes|no               If to skip the pre-prod verification or not"
}

function show_deployment_info() {
  echo ""
  echo "===== DEPLOYMENT INFORMATION ======================"
  echo " Application Folder: ${APPLICATION_FOLDER}"
  echo " Application Name:   ${APPLICATION_NAME}"
  echo " Image:              ${REGISTRY_IMAGE_FULL_PATH}"
  echo " Service:            ${SERVICE_NAME}"
  echo " Environment:        ${APP_ENV}"
  echo "==================================================="
  echo ""
}
# Check if the built image really exist or not
# before pulling it and deploy. This is to prevent
# the failure of deployment in image not found error.
function validate_image() {
  BLO="$1"
  if [ "$BLO" = "yes" ]; then
    echo "[INFO] Image is built for local only."
    return 0
  fi

  echo "[INFO] Validating the image path in the registry..."
  docker manifest inspect "${REGISTRY_IMAGE_FULL_PATH}" > /dev/null
  echo "[INFO] Pulling image from server..."
  docker image pull "${REGISTRY_IMAGE_FULL_PATH}"
}

# After run the configuration ($> docker compose config---),
# some information may be in wrong format, such as number to string,
# so the fine_tune is to adjust to make it the right configuration.
function fine_tune() {
  # When expose a port, the configure will change to string,
  # so we need to remove the surrounded double quote.
  sed -s "s/published: \"\(.*\)\"/published: \1/g"
}

# Generating the docker compose file for deployment. The docker compose file
# is a merged application level `docker-compose_deploy.yml` (if exists) with
# the base docker compose file located a the 
# `../../bin/build-deploy/docker-compose/docker-compose_deploy_base.yml`
function generate_deployment_file() {
  echo "[INFO] Generate deployment file..."
  cat "${DOCKER_COMPOSE_BASE_FILE}" \
    | sed -s "s/SERVICE_NAME/${APPLICATION_NAME}/g" \
    > ${TOUCHED_DOCKER_COMPOSE_BASE_FILE}

  if [ -f "${DOCKER_COMPOSE_DEPLOY_FILE}" ]; then
    echo "[INFO] Merging with project base docker compose file (docker-compose_deploy.yml)..."
    docker compose \
      --project-name "${STACK_NAME}" \
      --file ${TOUCHED_DOCKER_COMPOSE_BASE_FILE} \
      --file "${DOCKER_COMPOSE_DEPLOY_FILE}" \
      config > tmp.yml
  else
    echo "[INFO] Getting the docker-compose_deploy.yml..."
    docker compose \
      --project-name "${STACK_NAME}" \
      --file ${TOUCHED_DOCKER_COMPOSE_BASE_FILE} \
      config > tmp.yml
  fi

  echo "[INFO] Remove dummy files..."
  tail -n +2 tmp.yml | fine_tune > "${DOCKER_COMPOSE_FILE}"
  rm -fv tmp.yml  ${TOUCHED_DOCKER_COMPOSE_BASE_FILE}
}

# Deploys the service and updates teh stack
function deploy() {
  echo "[INFO] Start deployment..."
  docker stack deploy --with-registry-auth \
    --resolve-image=always \
    --compose-file=${DOCKER_COMPOSE_FILE} \
    "${STACK_NAME}"

  docker service update "${SERVICE_NAME}" --force

  echo "[INFO] Cleaning dummy files..."
  rm -rfv docker-compose_base.yml
}
