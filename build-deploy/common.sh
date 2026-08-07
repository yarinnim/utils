#! /usr/bin/bash

set -e

source .env

function get_registry_host() {
  DEFAULT_REGISTRY_HOST=${REGISTRY_HOST}
  REGISTRY_HOST="${REGISTRY_HOST:-$DEFAULT_REGISTRY_HOST}"
}


function login() {
  REGISTRY_USER=${REGISTRY_USER}
  REGISTRY_PWD=$(echo MGdhVkVHRU84UTF1RU8K | base64 --decode)
  docker login -u ${REGISTRY_USER} -p ${REGISTRY_PWD} $REGISTRY_HOST
}

# Get the application information
# - DOMAIN_NAME: The group of the application
# - APPLICATION_NAME: The name of the application
# - APPLICATION_FOLDER: The directory the application is located

function get_app_info() {
  IFS='/'
  read -ra FOUND <<< "$APP_NAME"
  DOMAIN_NAME="${FOUND[0]/@/}"
  export APPLICATION_NAME="${FOUND[1]}"
  export APPLICATION_FOLDER="${FOUND[1]}"
}

# Manipulates the user input/interact the the command line.
# The CLI support the defined option to interact between user.
# To make the option avialable we need to set
#
# local OPTIND # Is the getopts built-in function.
#
# Options:
#
# -b APP_BUILD_NUMBER     Overwrite the application build number defined in the ENV
# -e APP_ENV              Overwrite the application environment
# -v APP_VERSION          Overwrite the application version

function manipulate_options() {
  local OPTIND
  CLI_OPTIONS=":b:e:v:s:h"
  echo "[INFO] Validating application environment..."

  while getopts "$CLI_OPTIONS" opt; do
    case $opt in
      b)
        echo "[INFO] Overwrite build number from ${APP_BUILD_NUMBER} to ${OPTARG}..."
        APP_BUILD_NUMBER="${OPTARG}"
        ;;
      e)
        echo "[INFO] Overwrite the Env name from '$APP_ENV' to '${OPTARG}'..."
        APP_ENV="${OPTARG}"
        ;;
      v)
        echo "[INFO] Overwrite the App Version from '${APP_VERSION}' to '${OPTARG}'..."
        APP_VERSION="${OPTARG}"
        ;;
    esac
  done

  export APP_BUILD_NUMBER=${APP_BUILD_NUMBER}
  export APP_ENV=${APP_ENV}
  export APP_VERSION=${APP_VERSION}
}

# Checks to make sure the given application environment 
# is a valid environment name or not.

function validate_env() {
  ENVS=("dev" "test" "staging" "prod")

  if [[ ${ENVS[@]} =~ "$APP_ENV" ]]; then
    echo "[INFO] Processing for '$APP_ENV' environment..."
  else
    echo "[ERROR] Invalid environment, supports only: ${ENVS[*]}"
    exit 24
  fi
}

function validate() {
  local OPTIND
  manipulate_options "${@}"
  validate_env "${@}"
  get_registry_host
  get_app_info

  REGISTRY_PROJECT="${DOMAIN_NAME}"
  if [ "$APP_ENV" = "development" ]; then
    APP_ENV="dev"
  fi

  if [ "$APP_ENV" = "dev" ]; then
    REGISTRY_PROJECT+="-dev"
  fi

  echo "[INFO] Exporting environment variables..."

  export APP_BULID_NUMBER="${APP_BUILD_NUMBER}"
  export STACK_NAME="${DOMAIN_NAME}-${APP_ENV}"
  export IMAGE_NAME="${STACK_NAME}_${APPLICATION_NAME}"
  export SERVICE_NAME="${STACK_NAME}_${APPLICATION_NAME}"
  export IMAGE_VERSION="${APP_VERSION}-${APP_BUILD_NUMBER}"
  export REGISTRY_IMAGE="${REGISTRY_PROJECT}/${APPLICATION_NAME}"
  export REGISTRY_IMAGE_PATH="$REGISTRY_HOST/${REGISTRY_IMAGE}"
  export REGISTRY_IMAGE_FULL_PATH="${REGISTRY_IMAGE_PATH}:${IMAGE_VERSION}"
  export BUILD_LOCAL_ONLY="${BUILD_LOCAL_ONLY}"
}
