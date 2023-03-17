#!/bin/sh
mkdir -p ../common/deploy/runbotics-desktop;
rm -rf dist;

echo "[INFO] runbotics-desktop - Build started";
rushx build;
echo "[INFO] runbotics-desktop - Build completed";

echo "[INFO] runbotics-desktop - Rush deploy started";
rush deploy --overwrite --target-folder ../common/deploy/runbotics-desktop;
echo "[INFO] runbotics-desktop - Rush deploy completed";
