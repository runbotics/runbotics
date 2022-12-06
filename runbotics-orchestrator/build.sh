#!/bin/sh
PACKAGE_VERSION=$(./gradlew properties \
    | grep ^version: \
    | cut -c10-)
echo Version is: $PACKAGE_VERSION

echo "[INFO] runbotics-orchestrator - Gradle build started";
./gradlew bootJar -Pprod jibDockerBuild
echo "[INFO] runbotics-orchestrator - Gradle build completed";

echo "[INFO] runbotics-orchestrator - Docker image tag ${$PACKAGE_VERSION}"
docker tag runbotics/runbotics-orchestrator:latest runbotics/runbotics-orchestrator:${PACKAGE_VERSION}
