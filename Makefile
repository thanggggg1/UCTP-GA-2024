# help: ## Display this help screen
# 	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

# .PHONY: help

# SHELL=/bin/bash
# ROOT_DIR := $(shell git rev-parse --show-toplevel)
# BACKEND_DIR := $(ROOT_DIR)/backend
# FRONTEND_DIR := $(ROOT_DIR)/frontend

# deploy-server: ## Deploy server
# 	sh $(ROOT_DIR)/deployments/deploy-server.sh

# start-dev: ## Start dev
# 	docker-compose -f $(ROOT_DIR)/dev/docker-compose.dev.yml up -d  --force-recreate --no-deps --build $(ARGS)

# stop-dev: ## Stop dev
# 	sh $(ROOT_DIR)/dev/stop-dev.sh
