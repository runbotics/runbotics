docker-compose -f docker-compose.build.yml build
docker tag runbotic-desktop_runbotics-desktop runbotics/runbotics:runbotics-desktop_1_0_0
docker push runbotics/runbotics:runbotics-desktop_1_0_0
