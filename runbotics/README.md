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

Install docker on your environment in a way that suits you.

# Dependencies installation
Install all the required dependencies via

```bash
rush install
```

Install [CLI](https://github.com/runbotics/runbotics/pkgs/npm/runbotics-cli) tool to ease local development (running applications, bump version)

```bash
# Login to GitHub npm packages registry
npm login --registry https://npm.pkg.github.com

# Pass your GitHub login details. Instead of password use your personal access token

# Install package globally
npm install -g @runbotics/runbotics-cli --registry https://npm.pkg.github.com/runbotics
```

# Docker environment

Depending on your preferences you can either launch all the apps yourself or let docker containers do it for you based on latest images available on [dockerhub](https://hub.docker.com/u/runbotics).

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

# Packages

Go to package related folder to see run instructions

 - [runbotics-orchestrator](https://github.com/runbotics/runbotics/blob/master/runbotics-orchestrator)
 - [runbotics-orchestrator-ui](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-orchestrator-ui)
 - [runbotics-scheduler](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-scheduler)
 - [runbotics-desktop](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-desktop)
