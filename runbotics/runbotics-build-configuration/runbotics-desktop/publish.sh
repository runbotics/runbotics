#!/bin/sh
PACKAGE_VERSION=$(cat ./runbotics-desktop/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

echo "[INFO] runbotics-desktop - Docker build started";
docker build -t runbotics/runbotics-desktop:${PACKAGE_VERSION} -t runbotics/runbotics-desktop:latest .
echo "[INFO] runbotics-desktop - Docker build completed";

echo "[INFO] runbotics-desktop - Docker push started";
docker push runbotics/runbotics-desktop:${PACKAGE_VERSION}
echo "[INFO] runbotics-desktop - Docker push completed";
