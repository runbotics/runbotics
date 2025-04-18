#!/bin/bash

echo "[LOCAL-BUILD][INFO] Installing dependencies for rb-desktop..."
rush install -t .
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] cannot install dependencies"
    exit 1
fi

echo "[LOCAL-BUILD][INFO] Building rb-desktop..."
rush rebuild -t .
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] cannot build project"
    exit 1
fi

echo "[LOCAL-BUILD][INFO] Deploying rb-desktop to common deploy dir..."
./build.sh
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] fail with ./build.sh script"
    exit 1
fi

cd ../common/deploy/runbotics-desktop

echo "[LOCAL-BUILD][INFO] Copying .npmrc file from common rush config to deploy dir..."
grep //npm.pkg.github.com/:_authToken= ../../../common/config/rush/.npmrc >> .npmrc
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] cannot copy auth token from common rush .npmrc file"
    exit 1
fi

echo "[LOCAL-BUILD][INFO] Installing dependencies with electron inside deploy dir..."
./electron-install.sh
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] cannot install dependencies (with electron) inside deploy dir"
    exit 1
fi

cd runbotics-desktop

echo "[LOCAL-BUILD][INFO] Removing code certs for local use"
if ! command -v node 2>&1 >/dev/null
then
    echo "node is not installed in system"
    exit 1
fi

node -e '
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
delete pkg.build.win.certificateFile;
delete pkg.build.win.certificatePassword;
pkg.build.win.verifyUpdateCodeSignature = false;
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 4));
'
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] cannot update remove code cert"
    exit 1
fi

echo "[LOCAL-BUILD][INFO] Building electron release files with electron builder..."
pnpm electron-builder
if [ $? -ne 0 ]; then
    echo "[LOCAL-BUILD][ERROR] cannot make release build"
    exit 1
fi

echo "[LOCAL-BUILD][INFO] Done"