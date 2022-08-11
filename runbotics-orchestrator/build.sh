echo "[INFO] runbotics-orchestrator - Gradle build started";
./gradlew bootJar -Pprod jibDockerBuild
echo "[INFO] runbotics-orchestrator - Gradle build completed";
