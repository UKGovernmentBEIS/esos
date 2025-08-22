#!/bin/bash

prod=$1

if [ "$prod" == 'prod' ];
then
#  mvn clean install -P prod
  yarn install
  yarn build:production
else
#  mvn clean install -Dmaven.test.skip=true
  yarn install
  yarn build
fi
