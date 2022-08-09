#!/bin/sh
PACKAGE_VERSION="2.0.23"
echo "[INFO] runbotics-orchestrator - Gradle build started";
./gradlew bootJar -Pprod jibDockerBuild
echo "[INFO] runbotics-orchestrator - Gradle build completed";
echo "[INFO] runbotics-orchestrator - Docker build started";
docker tag runbotics:latest docker.clouddc.eu/runbotics-orchestrator:${PACKAGE_VERSION}
echo "[INFO] runbotics-orchestrator - Docker build completed";
echo "[INFO] runbotics-orchestrator - Docker push started";
docker push docker.clouddc.eu/runbotics-orchestrator:${PACKAGE_VERSION}
echo "[INFO] runbotics-orchestrator - Docker push completed";
