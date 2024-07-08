#!/bin/sh

ROOT_DIR=$(git rev-parse --show-toplevel)
docker-compose -f $ROOT_DIR/dev/docker-compose.dev.yml up -d  --force-recreate --no-deps --build  $1

#  --force-recreate --no-deps --build
