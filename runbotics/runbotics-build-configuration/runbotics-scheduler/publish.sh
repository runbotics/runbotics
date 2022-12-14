#!/bin/sh
PACKAGE_VERSION=$(cat ./runbotics-scheduler/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

sh build.sh $PACKAGE_VERSION

echo "[INFO] runbotics-scheduler - Docker push started";
docker push runbotics/runbotics-scheduler:${PACKAGE_VERSION}
docker push runbotics/runbotics-scheduler:latest
echo "[INFO] runbotics-scheduler - Docker push completed";
