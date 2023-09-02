#!/bin/sh

echo "[INFO] - Bump rush apps versions started"
cd runbotics && sh bump-rush.sh && cd ..
echo "[INFO] - Bump rush apps versions completed"

echo "[INFO] - Bump runbotics-orchestrator version started"
cd runbotics-orchestrator && npm version patch && ./gradlew incrementVersion --versionIncrementType=PATCH && cd ..
echo "[INFO] - Bump runbotics-orchestrator version completed"
