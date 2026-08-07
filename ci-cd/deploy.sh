#!/bin/bash

set -e

PROJECT_ROOT="/home/wwwroot"
PROJECT_PATH="${PROJECT_ROOT}/${CI_PROJECT_NAME}/apps/${APP}"

function set_host() {
  echo "[INFO] Setting host and access information"
}

function set_key() {
  mkdir -p ~/.ssh
  touch ~/.ssh/config
  touch ~/.ssh/known_hosts
  echo "${SSH_PRIVATE_KEY}" | tr -d '\r' > ~/.ssh/id_rsa
  chmod -R 400 ~/.ssh
}

function show_info() {
  echo "----- Deployment Information -------"
  echo " Host: ${HOST_IP}"
  echo " Host User: ${HOST_USER}"
  echo " App Env: ${APP_ENV}"
  echo " App: ${APP}"
  echo "------------------------------------"
}

function pull_deploy() {
  ssh -v -o StrictHostKeyChecking=no "${HOST_USER}@${HOST_IP}" "
    clear;
    cd ${PROJECT_PATH};
    sudo docker login -u ${REGISTRY_USER} -p ${REGISTRY_PWD} $REGISTRY_HOST;
    sudo git -c credential.helper='!f() { echo "username=${GITLAB_USER}"; echo "password=${GITLAB_PWD}"; }; f' pull;
    sudo git submodule update;
    echo '[INFO] Desploying from ci-cd...';
    # sudo ./pull-deploy.sh -v 2.0.0 -b 202411061026 -e test;
    ls -lart;
    sudo ./pull-deploy.sh -v ${APP_VERSION} -b ${APP_BUILD_NUMBER} -e ${APP_ENV};
    sudo ../../bin/ci-cd/update-env.sh -v ${APP_VERSION} -b ${APP_BUILD_NUMBER} -e ${APP_ENV};
    sudo ../../bin/ci-cd/send-telegram.sh -v ${APP_VERSION} -b ${APP_BUILD_NUMBER} -e ${APP_ENV};
  "
}

set_host
show_info
set_key
pull_deploy
