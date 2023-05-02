#!/bin/sh
mkdir -p ../common/deploy/runbotics-scheduler;
rm -rf dist;

echo "[INFO] runbotics-scheduler - Build started";
rushx build;
echo "[INFO] runbotics-scheduler - Build completed";

echo "[INFO] runbotics-scheduler - Rush deploy started";
rush deploy --scenario runbotics-scheduler --overwrite  --target-folder ../common/deploy/runbotics-scheduler;
echo "[INFO] runbotics-scheduler - Rush deploy completed";
