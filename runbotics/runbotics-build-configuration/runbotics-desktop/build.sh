#!/bin/sh
if [ -z "$1" ]
then
    PACKAGE_VERSION=$(cat ./runbotics-desktop/package.json \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[[:space:]]')
    echo Version is: $PACKAGE_VERSION
else
    PACKAGE_VERSION="$1"
fi

echo "[INFO] runbotics-desktop - Docker build started";
docker build --platform linux/amd64 -t runbotics/runbotics-desktop:${PACKAGE_VERSION} -t runbotics/runbotics-desktop:latest .
echo "[INFO] runbotics-desktop - Docker build completed";
