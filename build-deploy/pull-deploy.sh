#! /usr/bin/bash
#
# Pulls and deploys the built image located in the image registry.
# Currently, the built images are stored in the registry.
# To pull and build the image, we need to provide the following required information:
# (the information can be defined in the .env file, or use in the command line opation)
#
# Application Version:
#   APP_VERSION (.env)
#   -e (cli option)
#
# Application Build Number:
#   APP_BUILD_NUMBER (.env)
#   -b (cli option)
#
# Usage: sudo ./pull-deploy.sh [options]
#
# Options:
# -s yes|no   If the production verification deployment is skipped
# -b APP_BUILD_NUMBER The application build number
# -e APP_ENV The application environment

source ../../bin/build-deploy/common-deploy.sh

mkdir -p tmp
echo "[INFO] Validating the environment variables..."
echo "[INFO] Validation passed..."

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

validate_deployment_prod
show_deployment_info
validate_image "$BUILD_LOCAL_ONLY"
deploy
