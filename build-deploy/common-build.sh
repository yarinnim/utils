#! /usr/bin/bash

source ../../bin/build-deploy/common.sh

set -e

DOCKER_COMPOSE_BASE_FILE=../../bin/build-deploy/docker-compose/docker-compose_build.yml
DOCKER_COMPOSE_FILE=docker-compose_build.yml
APP_BUILD_NUMBER=$(date +%Y%m%d%H%M)

# Builds the image by using the pre-defined docker compose file ${DOCKER_COMPOSE_BASE_FILE}
# merged/flatted docker compose file of the application ${DOCKER_COMPOSE_FILE}
# which is located in the application folder. After the image is built, it is tagged
# automatically. Then the original image is deleted.

function build() { 
  echo "[INFO] Start building image..."
  if [ -f "${DOCKER_COMPOSE_FILE}" ]; then
    docker compose \
      --file "${DOCKER_COMPOSE_BASE_FILE}" \
      --file "${DOCKER_COMPOSE_FILE}" \
      build
  else
    docker compose \
      --file "${DOCKER_COMPOSE_BASE_FILE}" \
      build
  fi

  echo "[INFO] Tag the built image for registry..."
  docker tag "${IMAGE_NAME}:latest" "${REGISTRY_IMAGE_FULL_PATH}"
  docker image rm "${IMAGE_NAME}" > /dev/null
}

function push_built_image() {
  BLO="$1"
  if [ "$BLO" = "yes" ]; then
    echo "[INFO] Image is built for local only."
    return 0
  fi

  echo "[INFO] Pushing: ${REGISTRY_IMAGE_FULL_PATH}"
  docker push "${REGISTRY_IMAGE_FULL_PATH}"
  echo "[INFO] Removing pushed image"
  docker image rm "${REGISTRY_IMAGE_FULL_PATH}"
}

function show_build_info {
  echo ""
  echo "======== BUILD INFORMATION =============="
  echo " Application Folder: ${APPLICATION_FOLDER}"
  echo " Local image: ${IMAGE_NAME}"
  echo " Image Verion: ${IMAGE_VERSION}"
  echo " Registry Image: ${REGISTRY_IMAGE_PATH}"
  echo " Environment: ${APP_ENV}"
  echo "========================================="
  echo ""
}

# For CI/CD, we need to have another environment variables to be passed
# for the CI/CD purpose. So, this function will write the environment variable
# to a tempoary environment file named ``buidl.env``.

function generate_build_env() {
  echo "[INFO] Generating build.env for CI/CD purpose."
  echo "APP=${APPLICATION_NAME}" > build.env
  echo "APP_VERSION=${APP_VERSION}" >> build.env
  echo "APP_BUILD_NUMBER=${APP_BUILD_NUMBER}" >> build.env
  echo "IMAGE_VERSION=${IMAGE_VERSION}" >> build.env
}
