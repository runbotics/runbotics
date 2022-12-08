#!/bin/sh
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

sh build.sh $PACKAGE_VERSION

echo "[INFO] runbotics-orchestrator-ui - Docker push started";
docker push runbotics/runbotics-orchestrator-ui:${PACKAGE_VERSION}
docker push runbotics/runbotics-orchestrator-ui:latest
echo "[INFO] runbotics-orchestrator-ui - Docker push completed";
