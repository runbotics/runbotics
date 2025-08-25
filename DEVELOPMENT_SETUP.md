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

Use the provided `docker-compose-local.yml` to set up the required databases and services. The configuration is located in `runbotics/docker-compose-local.yml`.

## Starting Services

For development, start each component manually:

1. **Start databases and infrastructure:**
   ```bash
   docker compose -f docker-compose-local.yml up -d
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
