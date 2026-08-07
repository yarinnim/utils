#! /usr/bin/bash

rm -rfv apps/test-web
./bin/init-web test/test-web
./bin/init apps/test-web
npm run start:dev
