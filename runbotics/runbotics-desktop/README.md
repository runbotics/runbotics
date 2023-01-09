<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

The `runbotics-desktop` package based on [Nest.js](https://nestjs.com) is responsible for process execution and passing logs to the `runbotics-scheduler`.

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

See [Nest.js docs](https://docs.nestjs.com/) to learn about Nest.js feature.
