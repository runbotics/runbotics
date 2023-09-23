#!/bin/sh
if [ -z "$1" ]
then
    PACKAGE_VERSION=$(cat ./runbotics-scheduler/package.json \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[[:space:]]')
    echo Version is: $PACKAGE_VERSION
else
    PACKAGE_VERSION="$1"
fi

echo "[INFO] runbotics-scheduler - Docker build started";
docker build --platform linux/amd64 -t runbotics/runbotics-scheduler:${PACKAGE_VERSION} -t runbotics/runbotics-scheduler:latest .
echo "[INFO] runbotics-scheduler - Docker build completed";
