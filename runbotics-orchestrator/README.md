
# What does it do?
This is the original backend service for RunBotics. It’s now considered legacy—most CRUD operations have moved to the runbotics-scheduler service. The plan is to fully deprecate this service, but for now, it still handles user authentication.

# Getting Started
## Local development of other services
If you're working on other services (e.g. runbotics-scheduler, runbotics-orchestrator-ui, or runbotics-desktop) and don’t need to modify this one, you can simply run it via Docker:
```
docker compose up runbotics-orchestrator
```
Run the command from the /runbotics directory

## Local development of runbotics-orchestrator
1. Download java 11 from [here](https://openjdk.org/projects/jdk/) and add it to path.

2. Run the app
```
./gradlew
```

## Better alternative
Using IntelliJ IDEA Community Edition is the recommended alternative - it allows you to:

- install java from it
- run the app
- debug the app

To set it up:
1. Download IntelliJ IDEA Community Edition from [here](https://www.jetbrains.com/idea/download/)
2. Install java 11 through JDK or IntelliJ IDEA
3. Add new configuration for gradle and choose `runbotics-orchestrator` for gradle project

![image](https://github.com/user-attachments/assets/f3328477-3c67-43c2-b2f8-470e341e3aff)

4. Now you can not only run the app easily, but also debug it!

# Original README
This application was generated using JHipster 7.0.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.0.0](https://www.jhipster.tech/documentation-archive/v7.0.0).

