#!/bin/sh
ROOT_DIR=$(git rev-parse --show-toplevel)
docker-compose -f $ROOT_DIR/dev/docker-compose.dev.yml down
yes "" | docker volume prune
