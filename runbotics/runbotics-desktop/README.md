<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

The `runbotics-desktop` package based on [Nest.js](https://nestjs.com) is responsible for process execution and passing logs to the `runbotics-scheduler`.

## Environment variables setup
To make sure the bot has proper credentials you need to adjust credentials for bot user (`RUNBOTICS_USER` and `RUNBOTICS_PASSWORD` in .env).

## Running the app

```bash
# development
$ rushx start:dev

# debug
$ rushx start:debug

# production mode
$ rushx start
```

## Test

```bash
# unit tests
$ rushx test

# e2e tests
$ rushx test:e2e

# test coverage
$ rushx test:cov
```

## Docker image

To create your own `runbotics-desktop` docker image follow the instructions:

```bash
# execute rush deploy
$ sh build.sh

# go to ~/runbotics/common/deploy/runbotics-desktop

# build docker image
$ sh build.sh
```

## Local windows electron build
### Requirements:
- you should have write/read access to directory where you cloned GitHub repository (dir %USERPROFILE% in Windows is safe option for potential privileges issues)
- run script in the same directory as this README
- run script with bash interpreter but on **windows**
- have valid GitHub token in .npmrc (repo dir - common/config/rush)
- installed in system: **node, npm, pnpm, rush**
```bash
$ sh build-electron-local.sh
```

See [Nest.js docs](https://docs.nestjs.com/) to learn about Nest.js feature.
