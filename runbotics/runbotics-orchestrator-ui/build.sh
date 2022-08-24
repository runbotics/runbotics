#!/bin/sh
mkdir -p ../common/deploy/runbotics-orchestrator-ui;
echo "[INFO] runbotics-orchestrator-ui - Build started";
rushx build;
echo "[INFO] runbotics-orchestrator-ui - Build completed";

echo "[INFO] runbotics-orchestrator-ui - Rush deploy started";
rush deploy --scenario runbotics-orchestrator-ui --overwrite --target-folder ../common/deploy/runbotics-orchestrator-ui;
echo "[INFO] runbotics-orchestrator-ui - Rush deploy completed";
