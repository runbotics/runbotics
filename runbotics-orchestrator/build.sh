#!/bin/sh
if [ -z "$1" ]
then
    PACKAGE_VERSION=$(cat package.json \
        | grep version \
        | head -1 \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[[:space:]]')
    echo Version is: $PACKAGE_VERSION
else
    PACKAGE_VERSION="$1"
fi

echo "[INFO] runbotics-orchestrator - Gradle build started";
./gradlew bootJar -Pprod jibDockerBuild
echo "[INFO] runbotics-orchestrator - Gradle build completed";

echo "[INFO] runbotics-orchestrator - Docker image tag ${PACKAGE_VERSION}"
docker tag runbotics/runbotics-orchestrator:latest runbotics/runbotics-orchestrator:${PACKAGE_VERSION}
