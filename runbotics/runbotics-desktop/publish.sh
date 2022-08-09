#!/bin/sh
mkdir -p ../common/deploy/runbotics-desktop;
echo "[INFO] runbotics-desktop - Build started";
rushx build;
echo "[INFO] runbotics-desktop - Build completed";
echo "[INFO] runbotics-desktop - Local deploy started";
rush deploy --overwrite --target-folder ../common/deploy/runbotics-desktop;
echo "[INFO] runbotics-desktop - Local deploy completed";
cd ../common/deploy/runbotics-desktop
./publish.sh