## Description

`runbotics-cli` is a CLI that helps in RunBotics application development. Supported commands:

```bash
$ rb <package> [options] # Runs selected package in development mode (choices: "ui", "api", "scheduler", "bot")

$ rb docker|d [operation] # Pulls latest images then create and start docker compose containers detached (choices: "pull", "up", "down")

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

in order to use the global `rb` command in development environment, make sure to uninstall `@runbotics/runbotics-cli` and follow these steps

```bash
# Install yarn globally
$ npm install --global yarn

# Check that Yarn is installed
$ yarn --version
```

check `/Yarn/bin` directory and add the directory to the PATH on your machine

```bash
# To check directory where global links are saved
$ yarn global bin
```

to create a global link, change directory to `/runbotics/runbotics-cli` and run

```bash
# To create global link
$ yarn link-cli

# To remove global link
$ yarn unlink-cli
```

after these steps you can use `rb` command based on local changes in `/runbotics/runbotics-cli`
