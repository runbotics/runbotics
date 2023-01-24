## Description

`runbotics-cli` is a CLI that helps in RunBotics application development. Supported commands:

```bash
$ rb <package> # Runs selected package in development mode (choices: "ui", "api", "scheduler", "bot")

$ rb docker|d [operation] # Pulls latest images then create and start docker compose containers detached

$ rb install|i # Runs "rush install" command

$ rb update|u # Runs "rush update" command

$ rb version|v [options] # Bumps all crucial RunBotics packages versions (prerelease is bumped by default)
```

use `rb --help` for more detailed information

## Installation

```bash
# Login to GitHub npm packages registry
$ npm login --registry https://npm.pkg.github.com

# Pass your GitHub login details. Instead of password use your personal access token

# Install package globally
$ npm install -g @runbotics/runbotics-cli --registry https://npm.pkg.github.com/runbotics
```

## App development
```bash
# Install package dependencies
$ npm install

# Build package
$ npm run build

# Start CLI
$ npm run start
```
