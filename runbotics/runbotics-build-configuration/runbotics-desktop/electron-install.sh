echo $'[INFO] - runbotics-sdk install start\n'
cd runbotics-sdk && pnpm install --ignore-scripts && cd ..
echo $'\n[INFO] - runbotics-sdk install finished'

echo $'\n[INFO] - runbotics-common install start\n'
cd runbotics-common && pnpm install --ignore-scripts && cd ..
echo $'\n[INFO] - runbotics-common install finished'

echo $'\n[INFO] - runbotics-actions-windows install start\n'
cd runbotics-actions-windows && \
pnpm add runbotics-sdk@file:../runbotics-sdk && \
pnpm install --ignore-scripts && cd ..
echo $'\n[INFO] - runbotics-actions-windows install finished'

echo $'\n[INFO] - runbotics-desktop install start\n'
cp .npmrc ./runbotics-desktop && \
cd runbotics-desktop && \
pnpm add runbotics-common@file:../runbotics-common \
    runbotics-sdk@file:../runbotics-sdk \
    runbotics-actions-windows@file:../runbotics-actions-windows && \
pnpm install --ignore-scripts && cd ..
echo $'\n[INFO] - runbotics-desktop install finished'
