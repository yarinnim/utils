#! /usr/bin/bash

source ../../bin/build-deploy/common-deploy.sh

# As the web build need to add the web enviroment as sufix,
# so we need to adjust the image with env as suffix

mkdir -p locales

function touch_deployment_info() {
  REGISTRY_IMAGE_PATH+="_${APP_ENV}"
  REGISTRY_IMAGE_FULL_PATH="${REGISTRY_IMAGE_PATH}:${IMAGE_VERSION}"
  DOCKER_COMPOSE_BASE_FILE=../../bin/build-deploy/docker-compose/docker-compose_deploy_base-web.yml
}

validate "${@}"

while getopts "$CLI_OPTIONS" opt; do
  case $opt in
    h)
      show_deployment_help
      exit 1;
      ;;
    s)
      SKIP_PROD_VERIFICATION="${OPTARG}"
      ;;
  esac
done

touch_deployment_info
show_deployment_info
validate_deployment_prod
validate_image "$BUILD_LOCAL_ONLY"
deploy
