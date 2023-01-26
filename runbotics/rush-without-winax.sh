#!/bin/bash

#throw error if user have unsaved git changes
if [[ -n $(git status -s) ]]; then
    echo "You have unsaved changes. Please commit or stash them before running this script.";
    exit 1;
fi

sed -i 's/^/\/\//' ./runbotics-actions-windows/src/index.ts;
sed -i 's/^/\/\//' ./runbotics-actions-windows/src/automation/office/power-point.action-handler.ts;
sed -i 's/^/\/\//' ./runbotics-actions-windows/src/automation/office/excel.action-handler.ts;
sed -i '/import '\''winax'\'';/s/^/\/\//' ./runbotics-desktop/src/action/sap/sap.action-handler.ts;
sed -i '/winax/d' ./runbotics-desktop/package.json;
sed -i '/winax/d' ./runbotics-actions-windows/package.json;

rush update;

git restore .

exit 0;