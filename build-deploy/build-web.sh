#! /usr/bin/bash

source ../../bin/build-deploy/common-build.sh
set -e

# As the web build need to add the web enviroment as sufix,
# so we need to adjust the image with env as suffix

function touch_build_info() {
  REGISTRY_IMAGE_PATH+="_${APP_ENV}"
  REGISTRY_IMAGE_FULL_PATH="${REGISTRY_IMAGE_PATH}:${IMAGE_VERSION}"
}

validate "${@}"
touch_build_info
show_build_info
build
push_built_image "$BUILD_LOCAL_ONLY"
generate_build_env
