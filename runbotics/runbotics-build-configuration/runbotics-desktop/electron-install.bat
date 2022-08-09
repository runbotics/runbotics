cd runbotics-sdk && npm install & cd .. && ^
cd runbotics-common && npm install & cd .. && ^
cd runbotics-actions-windows && npm install --save runbotics-sdk@file:../runbotics-sdk & cd .. && ^
cd runbotics-desktop && npm install --save runbotics-common@file:../runbotics-common --save runbotics-sdk@file:../runbotics-sdk --save runbotics-actions-windows@file:../runbotics-actions-windows & cd ..
