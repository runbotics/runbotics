<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

The `runbotics-scheduler` package based on [Nest.js](https://nestjs.com) is responsible for:

- bot connection
- process triggering
- process scheduling
- process termination
- and many more - the goal is to migrate the whole backend to this package and it's at advanced stage.

It is available at `http://localhost:4000`.

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

To create your own `runbotics-scheduler` docker image follow the instructions:

```bash
# execute rush deploy
$ sh build.sh

# go to ~/runbotics/common/deploy/runbotics-scheduler

# build docker image
$ sh build.sh
```

## Windows installer
```bash
# execute rush deploy
$ sh build.sh

# go to ~/runbotics/common/deploy/runbotics-scheduler

# build and install dependencies
$ sh electron-install.sh

# execute electron builder
$ sh electron-build.sh
```

See [Nest.js docs](https://docs.nestjs.com/) to learn about Nest.js feature.
