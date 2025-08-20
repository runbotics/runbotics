# RunBotics Development Setup

This guide provides instructions for setting up a complete RunBotics development environment.

## Prerequisites

- Docker and Docker Compose
- Node.js and npm/yarn
- Git
- Java (for orchestrator development)
- Git Bash (for Windows users)
- @microsoft/rush: `npm install --global @microsoft/rush`

## RunBotics CLI Installation

Install the RunBotics CLI tool to ease local development (running applications, bumping versions, etc.):

```bash
# Login to GitHub npm packages registry
npm login --registry https://npm.pkg.github.com

# Pass your GitHub login details. Instead of password use your personal access token.

# Install package globally
npm install -g @runbotics/runbotics-cli --registry https://npm.pkg.github.com/runbotics
```

After installation, you can use the `rb` command to manage RunBotics services.

## Overview

To run RunBotics in development mode, you need to start the following components:

1. **Bot** - Desktop application for process execution
2. **Scheduler** - Backend service for bot management and scheduling
3. **Orchestrator** - Main backend API service
4. **UI** - Frontend web application
5. **LP** - Landing page
6. **Proxy** - Either nginx or dev proxy in runbotics-proxy

## Database Setup

Use the provided `docker-compose.yml` to set up the required databases and services:

```yaml
services: 
  runbotics-postgresql:
    container_name: runbotics-postgresql
    image: postgres:13.2
    volumes:
      - runbotics:/var/lib/postgresql/data/
    environment:
      - POSTGRES_USER=runbotics
      - POSTGRES_PASSWORD=runbotics
      - POSTGRES_HOST_AUTH_METHOD=trust
    networks:
      - default
      - db
    ports:
      - 0.0.0.0:5432:5432
 
  runbotics-orchestrator:
    container_name: runbotics-orchestrator
    image: runbotics/runbotics-orchestrator:latest
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:postgresql://runbotics-postgresql:5432/runbotics
      - SPRING_DATASOURCE_USERNAME=runbotics
      - SPRING_DATASOURCE_PASSWORD=runbotics
      - BOT_INSTALLATION_FILE=./installation/RunBotics_2.0.7.zip
      - RUNBOTICS_SECRET=ODQ4ZDBjNTgzYTE3ZjI3ZTE2YzFiNDI4MGY0OTFmMGQ1YjM0ZjEyNzI1ZTBhOTk3Nzg0ZTkxNTk4Y2JmZGQ0ZTA0YjEyM2E1OGI3YTA4ODhiNTkxYjI0MzkzNGU3YTUwOWEzMjZjZDk2YTJkYjIyMzQzMjhhYTEwMTYwYTc0MmI=
    ports:
      - 0.0.0.0:8080:8080
    networks:
      - default
      - db
    depends_on:
      - runbotics-postgresql
    extra_hosts:
      - 'host.docker.internal:host-gateway'
 
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    restart: always
    ports:
      - "0.0.0.0:9898:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    networks:
      - default
      - db
    depends_on:
      - runbotics-postgresql
 
  runbotics-redis:
    container_name: runbotics-redis
    image: redis:6
    ports:
      - 0.0.0.0:6379:6379
    networks:
      - default
      - db
      
  firefox:
    container_name: firefox
    image: selenium/standalone-firefox:140.0-geckodriver-0.36-grid-4.34.0-20250707
    ports:
      - 0.0.0.0:7901:7900
      - 0.0.0.0:4444:4444
    networks:
      - default
      - db
    shm_size: 2gb
    environment:
      SE_NODE_OVERRIDE_MAX_SESSIONS: 'true'
      SE_NODE_MAX_SESSIONS: 1
      JAVA_OPTS=-XX:ActiveProcessorCount: 1
 
volumes:
  runbotics:
    external: true
  portainer_data:
    external: false
  pgadmin-data:
 
networks:
  db:
  default:
    name: runbotics-dev
    attachable: true
```

## Starting Services

For development, start each component manually:

1. **Start databases and infrastructure:**
   ```bash
   docker-compose up -d # Remove orchestator from docker-compose.yml above if it should run locally
   ```

2. **Start each component individually:**
   - Bot: `rb bot` (only run when required)
   - Scheduler: `rb scheduler`
   - Orchestrator: Can be run with `rb api` (only when docker doesn't run orchestrator) or docker depending on development needs
   - UI: `rb ui`
   - LP: `rb lp`
   - Proxy: `rb proxy`

## Orchestrator Development Options

The orchestrator can be run in different ways depending on your development needs:

1. **Using rb CLI:** `rb api` compile & run directly from source
2. **Docker container:** Use the docker-compose setup above (**recommended for most development scenarios**)

## Windows Development Notes

### Git Bash Requirement

**Important:** On Windows, the `rb` CLI commands work only with Git Bash, not with Command Prompt or PowerShell.

### Terminal Hanging Prevention

To prevent the terminal from hanging after pressing `Ctrl+C` in Git Bash on Windows, add this function to your `.bashrc` or `.bash_profile`:

```bash
function r() {
    echo Y | rb "$1"
}
```

## Service URLs

Once all services are running, you can access the page via proxy on http://localhost:7777