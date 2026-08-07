#!/bin/bash

# From the commit message or merge request title, we need to study
# if the content is wrapped with `[` and `]` or not. If it's wrapped
# with tag, we need to make sure if the project folder really exists
# or not (project folder reflects the project name). If all the
# mention information matches, it will check if which branch
# is the commit in, so it will deploy the its evironment (`develop` or `test`).

function get_app_name() {
  export APP=$(echo "$CI_COMMIT_TITLE" | grep -o '\[.*\]' | sed 's/[][]//g')
  if [ -z "${APP}" ]; then
    APP=$(echo "$CI_COMMIT_DESCRIPTION" | grep -o '\[.*\]' | sed 's/[][]//g')
    if [ -z "${APP}" ]; then
      echo "[INFO] Application not mentioned (${APP})"
      echo "[INFO] Skipping next stage"
      exit 1
    fi
  fi

  APP_DIR="apps/${APP}"
  if [[ ! -d "$APP_DIR" ]]; then
    echo "[ERROR] Application not found (${APP})"
    echo "[INFO] Skipping Job"
    exit 1
  fi

  export APP_ENV="development"
  if [ "${CI_COMMIT_BRANCH}" != "develop" ]; then
    APP_ENV="test"
  fi
}

# To make sure the built image information is passed to
# destination server (server which is use for deployment),
# we need to generate the information into the `build.env`
# file and ship it to the deployment server.
function generate_build_env() {
  echo "[INFO] Current Path: $(pwd)"
  # List files and directories in the current path
  echo "[INFO] Generating the build.env for built image information..."
  echo "APP=${APP}" > build.env
  echo "APP_DIR=${APP_DIR}" >> build.env
  echo "APP_ENV=${APP_ENV}" >> build.env
}

function show_env() {
  echo ""
  echo "==== CI/CD Env ===================="
  more build.env
  echo "==================================="
  echo ""
}

get_app_name
generate_build_env
show_env
