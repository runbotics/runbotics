#!/bin/sh
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

echo "[INFO] runbotics-orchestrator-ui - Docker build started";
docker build -t runbotics/runbotics-orchestrator-ui:${PACKAGE_VERSION} -t runbotics/runbotics-orchestrator-ui:latest ..
echo "[INFO] runbotics-orchestrator-ui - Docker build completed";
