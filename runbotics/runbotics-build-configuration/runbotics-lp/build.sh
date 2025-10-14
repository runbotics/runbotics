#!/bin/sh
if [ -z "$1" ]
then
    PACKAGE_VERSION=$(cat ./runbotics-lp/package.json \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[[:space:]]')
    echo Version is: $PACKAGE_VERSION
else
    PACKAGE_VERSION="$1"
fi

echo "[INFO] runbotics-lp - Docker build started";
docker build -f Dockerfile -t runbotics/runbotics-lp:${PACKAGE_VERSION} -t runbotics/runbotics-lp:latest .
echo "[INFO] runbotics-lp - Docker build completed";
