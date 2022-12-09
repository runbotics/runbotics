# Prerequisites

### windows-build-tools

```bash
$ npm install --global --production windows-build-tools
```

### @microsoft/rush

```bash
$ npm install --global @microsoft/rush
```

### docker

Install docker on your environment in a way that suits you then create a docker volume to save your local progress.

```bash
$ docker volume create runbotics
```

# Dependencies installation
Install all the required dependencies via

```bash
$ rush install
```

# Local dependencies installation

### runbotics-common

1. Go to `runbotics-common` folder
2. Build package via

```bash
$ rushx build
```

### runbotics-sdk

1. Go to `runbotics-sdk` folder
2. Build package via

```bash
$ rushx build
```

### runbotics-actions-windows

1. Go to `runbotics-actions-windows` folder
2. Build package via

```bash
$ rushx build
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
Main docker compose [config](https://github.com/runbotics/runbotics/blob/master/runbotics/docker-compose.yml) provides all the packages as docker containers.
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