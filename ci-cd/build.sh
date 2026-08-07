#!/bin/bash

function show_help() {
  echo "Build the image in CI/CD Stage"
  echo "Syntax: ./build.sh [-e ENV] [-v APP_VERSION]"
  echo ""
  echo "Options:"
  echo "-e APP_ENV Overwrite the application environment"
  echo "-v APP_VERSION Overwrite the application version"
}

function registry_login() {
  echo "[INFO] Login into Registry"
  # User: $REGISTRY_USER \nPwd: $REGISTRY_PWD"
  docker login -u $REGISTRY_USER -p $REGISTRY_PWD $REGISTRY_HOST
}

function validate_env() {
  echo "[INFO] Validating building environment."
  ENV_TEMPLATE_FILE="env.example"
  if [ ! -f "${ENV_TEMPLATE_FILE}" ]; then
    echo "[ERROR] CI/CD Environment file (${ENV_TEMPLATE_FILE}) not found..."
    exit 1
  fi

  echo "[INFO] Copy '${ENV_TEMPLATE_FILE}' into '.env' file...";
  cp "${ENV_TEMPLATE_FILE}" .env

  source .env
  echo "CI_CD_HOST: ${CI_CD_HOST}"
}

function display_info() {
  echo "[INFO] Building application '${APP}'..."
  echo "[INFO] Branch: ${CI_COMMIT_BRANCH}"
  cd "apps/${APP}" || exit 1

  if [ "${CI_COMMIT_BRANCH}" != "develop" ]; then
    echo "[INFO] This build is for production ready..."
    APP_ENV="test"
  fi
}

function get_deploy_env() {
  HOST_USER=ubuntu
  cp $CI_CD_CONFIG ci-cd.env
  source ci-cd.env
  STR_HOST="${APP_ENV^^}_${DEPLOYMENT_HOST}_IP"
  HOST_IP=${!STR_HOST}
  echo "APP_ENV=${APP_ENV}" >> build.env
  echo "HOST_IP=${HOST_IP}" >> build.env
  echo "HOST_USER=${HOST_USER}" >> build.env
  echo "==== Deployment Environment ======="
  more build.env
  echo "==================================="
}

display_info
registry_login
validate_env
bash build.sh -e "${APP_ENV}"
get_deploy_env
