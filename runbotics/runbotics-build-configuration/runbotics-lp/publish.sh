#!/bin/sh
PACKAGE_VERSION=$(cat ../../runbotics-lp/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

sh build.sh $PACKAGE_VERSION

echo "[INFO] runbotics-lp - Docker push started";
docker push runbotics/runbotics-lp:${PACKAGE_VERSION}
docker push runbotics/runbotics-lp:latest
echo "[INFO] runbotics-lp - Docker push completed";
