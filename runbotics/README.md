# Prerequisites

### Visual C++ Build Tools & Python

```bash
choco install python visualcpp-build-tools
```

### @microsoft/rush

```bash
npm install --global @microsoft/rush
```

### Docker

Install docker on your environment in a way that suits you - the preferred way is to use native CLI for Linux or WSL with Ubuntu for Windows [WSL + Ubuntu + Docker](https://docs.docker.com/engine/install/ubuntu/). Follow up with the docker compose installation.

Depending on what you want to achieve you can launch any combination of services as container listed on [dockerhub](https://hub.docker.com/u/runbotics). For example If you wark on the runbotics-orchestrator-ui service you can launch backend services: runbotics-postgres, runbotics-scheduler and runbotics-orchestrator as containers.

To run all services as containers you can use docker compose file in the runbotics/ directory of this repository.

```bash
cd runbotics
docker compose up -d
```

# Dependencies installation
Install all the required dependencies for the whole project via

```bash
rush install
```

### Runbotics CLI
Optional: Install [CLI](https://github.com/runbotics/runbotics/pkgs/npm/runbotics-cli) tool to ease local development (running applications, bumping application version)

```bash
# Login to GitHub npm packages registry
npm login --registry https://npm.pkg.github.com

# Pass your GitHub login details. Instead of password use your personal access token.

# Install package globally
npm install -g @runbotics/runbotics-cli --registry https://npm.pkg.github.com/runbotics
```

# Docker

### Managing containers
All composes include additional container with **Portainer** image. It's a web replacement for Docker Desktop and it's available by default at port **9000**.
After first install and once you've navigated to app, it will ask you to create initial admin account with custom password. Next, after login you just need to proceed with local docker environment by clicking 'Get started'.

**In order to create all below composes you will need sudo privileges.**

### DIY
Docker compose [config](https://github.com/runbotics/runbotics/blob/master/runbotics/db.yml) in `db.yml` provides only necessary database containers for the correct operation of the packages.

```bash
# Create containers
$ docker compose -f db.yml up -d

# Kill all related containers
$ docker compose -f db.yml down
```

### Services as containers
Main docker compose [config](https://github.com/runbotics/runbotics/blob/master/runbotics/docker-compose.yml) provides the packages as docker containers, all you need to run by yourself is `runbotics-orchestrator-ui` to interact with app through user interface.

```bash
# Create containers
sudo docker-compose -f docker-compose.yml up -d

# Kill all related containers
docker-compose down

# Pull the latest images
$ docker compose pull
```

# Packages & Overview

Go to package related folder to see run instructions

 - [runbotics-orchestrator](https://github.com/runbotics/runbotics/blob/master/runbotics-orchestrator) - orignally the backend service for the app, currently in the process of being replaced with the runbotics-scheduler service. Still handles the user authorization.
 - [runbotics-orchestrator-ui](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-orchestrator-ui) - the UI for the user to interact with the app.
 - [runbotics-scheduler](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-scheduler) - the CRUD and general backend service for the app.
 - [runbotics-desktop](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-desktop) - the bot executing the processes that are being automated.

### Other packages
Not services, but still useful

- [runbotics-cli](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-cli) - the CLI for the project.
- [runbotics-common](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-common) - the typescript types shared between the packages.
- [runbotics-cli](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-cli) - mentioned earlier, optional CLI tool to ease local development. The installation instruction in this readme are the most up to date.