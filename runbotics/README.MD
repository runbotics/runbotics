# Prerequisites

### Visual C++ Build Tools & Python

```bash
$ choco install python visualcpp-build-tools
```

### @microsoft/rush

```bash
$ npm install --global @microsoft/rush
```

### Docker

Install docker on your environment in a way that suits you then create a docker volume to save your local progress.

```bash
$ docker volume create runbotics
```

# Dependencies installation
Install all the required dependencies via

```bash
$ rush install
```

Install tool to ease local development (running applications, bump version)

```bash
npm install -g @runbotics/runbotics-cli
```

# Docker environment

Depending on your preferences you can either launch all the apps yourself or let docker containers do it for you based on latest images available on [dockerhub](https://hub.docker.com/u/runbotics).

### DIY
Docker compose [config](https://github.com/runbotics/runbotics/blob/master/runbotics/db.yml) in `db.yml` provides only necessary database containers for the correct operation of the packages.

```bash
# Create containers
$ docker-compose -f db.yml up -d

# Kill all related containers
$ docker-compose -f db.yml down
```

### Services as containers
Main docker compose [config](https://github.com/runbotics/runbotics/blob/master/runbotics/docker-compose.yml) provides the packages as docker containers, all you need to run by yourself is `runbotics-orchestrator-ui` to interact with app through user interface.

```bash
# Create containers
$ docker-compose up -d

# Kill all related containers
$ docker-compose down

# Pull the latest images 
$ docker-compose pull
```

# Packages

Go to package related folder to see run instructions

 - [runbotics-orchestrator](https://github.com/runbotics/runbotics/blob/master/runbotics-orchestrator)
 - [runbotics-orchestrator-ui](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-orchestrator-ui)
 - [runbotics-scheduler](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-scheduler)
 - [runbotics-desktop](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-desktop)