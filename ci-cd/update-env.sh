#!/bin/bash

set -e

source ../../bin/build-deploy/common.sh
source .env

DEPLOYED_AT=$(date "+%Y-%m-%d %T%Z")
echo "${DEPLOYED_AT}: ${APP_ENV}@${APP_VERSION}-${APP_BUILD_NUMBER}" >> build.archive

manipulate_options "${@}"

sed -i.bak "s|^APP_VERSION=.*|APP_VERSION=${APP_VERSION}|" .env
sed -i.bak "s|^APP_BUILD_NUMBER=.*|APP_BUILD_NUMBER=${APP_BUILD_NUMBER}|" .env

echo "BUILT_AT=$(date)" > build.env
echo "APP_ENV=${APP_ENV}" >> build.env
echo "APP_VERSION=${APP_VERSION}" >> build.env
echo "APP_BUILD_NUMBER=${APP_BUILD_NUMBER}" >> build.env
