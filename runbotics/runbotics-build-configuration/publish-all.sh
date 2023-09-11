echo "[INFO] - Deployment process started"
cd ../runbotics-desktop;
./publish.sh &
cd ../runbotics-scheduler;
./publish.sh &
cd ../runbotics-orchestrator-ui;
./publish.sh &
cd ../../runbotics-orchestrator;
./publish.sh &
wait
echo "[INFO] - Deployment process completed"
read;