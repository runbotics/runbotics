#!/bin/sh
mkdir -p ../common/deploy/runbotics-scheduler;
echo "[INFO] runbotics-scheduler - Build started";
rushx build;
echo "[INFO] runbotics-scheduler - Build completed";
echo "[INFO] runbotics-scheduler - Local deploy started";
rush deploy --scenario runbotics-scheduler --overwrite  --target-folder ../common/deploy/runbotics-scheduler;
echo "[INFO] runbotics-scheduler - Local deploy completed";
cd ../common/deploy/runbotics-scheduler
./publish.sh
