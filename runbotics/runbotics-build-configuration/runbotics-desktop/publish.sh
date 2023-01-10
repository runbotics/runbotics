#!/bin/sh
PACKAGE_VERSION=$(cat ./runbotics-desktop/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

sh build.sh $PACKAGE_VERSION

echo "[INFO] runbotics-desktop - Docker push started";
docker push runbotics/runbotics-desktop:${PACKAGE_VERSION}
docker push runbotics/runbotics-desktop:latest
echo "[INFO] runbotics-desktop - Docker push completed";
