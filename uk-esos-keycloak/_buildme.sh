#!/bin/bash

mvn clean install
# shellcheck disable=SC2181
if [[ "$?" -ne 0 ]]; then
  echo 'Maven build failed'
  exit 2
fi

docker image build -t keycloak-esos:latest -f Dockerfile .