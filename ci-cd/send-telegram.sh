#!/bin/bash

source ../../bin/build-deploy/common.sh
source .env

TG_BOT_TOKEN=8897461308:AAGwEF8Adpkhh2_Z6WY4DcyRC4qQcBzEZmA
TG_CICD_CHAT_ID=-1003792252167

manipulate_options "${@}"


DEPLOYED_AT=$(date "+%Y-%m-%d %T%Z")

MESSAGE="
Build Success
- App: ${APP_NAME}
- App Env: ${APP_ENV}
- App Version: ${APP_VERSION}
- App Build Number: ${APP_BUILD_NUMBER}
- Deployed At: ${DEPLOYED_AT}
"

if [ -z "$TG_BOT_TOKEN" ] || [ -z "$TG_CICD_CHAT_ID" ]; then
  echo "❌ ERROR: Required environment variables TG_BOT_TOKEN or TG_CHAT_ID are not set."
  echo "Please export them before running the script."
  exit 1
fi

API_URL="https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage"

echo "[INFO] Sending Telegram Message to Group"

curl -s -X POST "${API_URL}" \
  -d "chat_id=${TG_CICD_CHAT_ID}" \
  -d "text=${MESSAGE}" &> /dev/null
#  -d "parse_mode=MarkdownV2"
