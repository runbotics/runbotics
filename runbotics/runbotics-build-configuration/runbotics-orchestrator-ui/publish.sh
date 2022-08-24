#!/bin/sh
PACKAGE_VERSION=$(cat ./runbotics-orchestrator-ui/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

echo "[INFO] runbotics-orchestrator-ui - Docker build started";
docker build -t runbotics/runbotics-orchestrator-ui:${PACKAGE_VERSION} .
echo "[INFO] runbotics-orchestrator-ui - Docker build completed";

echo "[INFO] runbotics-orchestrator-ui - Docker push started";
docker push runbotics/runbotics-orchestrator-ui:${PACKAGE_VERSION}
echo "[INFO] runbotics-orchestrator-ui - Docker push completed";