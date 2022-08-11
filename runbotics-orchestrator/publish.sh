#!/bin/sh
PACKAGE_VERSION=$(./gradlew properties \
    | grep ^version: \
    | cut -c10-)
echo Version is: $PACKAGE_VERSION

echo "[INFO] runbotics-orchestrator - Docker build started";
docker tag runbotics:latest runbotics/runbotics-orchestrator:${PACKAGE_VERSION}
echo "[INFO] runbotics-orchestrator - Docker build completed";

echo "[INFO] runbotics-orchestrator - Docker push started";
docker push runbotics/runbotics-orchestrator:${PACKAGE_VERSION}
echo "[INFO] runbotics-orchestrator - Docker push completed";
