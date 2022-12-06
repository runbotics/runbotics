# Runbotics

## Description

Runbotics is a process automation application that allows you to easily create and execute automated workflows using your favourite cloud services along with desktop applications.

Runbotics via open-source distribution model enables you to extend its basic functionalities with your own custom logic. Available self-hosting makes automation accessible to everyone in individual circumstances.

![Runbotics screenshot](https://github.com/runbotics/runbotics/blob/master/public/3_process_build_running.png)

See more at [runbotics.com](https://www.runbotics.com)

## Installation

### Requirements

In order to run locally Runbotics you need to fulfill the following requirements on your development environment:

- `Node.js 14`
- `Java 11`
- `windows-build-tools`
- `@microsoft/rush`

For more info see [runbotics](https://github.com/runbotics/runbotics/blob/master/runbotics/README.md) package details.

### Packages

Runbotics application relies on several packages. To get started see the instructions of each package listed below.

 - [runbotics-orchestrator](https://github.com/runbotics/runbotics/blob/master/runbotics-orchestrator) - CRUD API
 - [runbotics-orchestrator-ui](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-orchestrator-ui) - GUI
 - [runbotics-scheduler](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-scheduler) - microservice focused on managing process execution
 - [runbotics-desktop](https://github.com/runbotics/runbotics/blob/master/runbotics/runbotics-desktop) - standalone process executioner

## Contributing

The main purpose of this repository is to continue evolving Runbotics. Development happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Runbotics.

### [Code of Conduct](https://github.com/runbotics/runbotics/blob/master/CODE_OF_CONDUCT.md)

Runbotics has adopted a Code of Conduct that we expect project participants to adhere to. Please read the full text so that you can understand what actions will and will not be tolerated.

### [Contribution guidelines](https://github.com/runbotics/runbotics/blob/master/CONTRIBUTING.md)

Read our contributing guidelines to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

## License

Runbotics is [MIT licensed](https://github.com/runbotics/runbotics/blob/master/license.md).
