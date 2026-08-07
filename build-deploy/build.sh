#! /usr/bin/bash

source ../../bin/build-deploy/common-build.sh
set -e

validate "${@}"
show_build_info
build
push_built_image "$BUILD_LOCAL_ONLY"
generate_build_env
