#! /usr/bin/env node

import chalk from 'chalk';
import { Argument, program } from 'commander';
import { version as packageVersion } from '../package.json';

import version from './commands/version';
import run from './commands/run';
import logo from './commands/logo';
import docker from './commands/docker';
import install from './commands/install';
import update from './commands/update';
import firstCharUpperCase from './utils/first-upper';

program
    .name('rb')
    .usage('[command] [options] <package>')
    .version(packageVersion);

program
    .description('Runs selected package in development mode')
    .addArgument(new Argument('<package>', 'name of the package').choices(['ui', 'api', 'scheduler', 'bot', 'lp']))
    .option('-p, --production', 'runs package in production mode')
    .option('-d, --debug', 'runs package in debug mode')
    .action(run);

program
    .command('docker')
    .alias('d')
    .description('Pulls latest images then create and start docker compose containers detached')
    .addArgument(new Argument('[operation]', 'Specify type of the operation').choices(['pull', 'up', 'down']))
    .action(docker);

program
    .command('install')
    .alias('i')
    .description('Runs "rush install" command')
    .action(install);
    
program
    .command('update')
    .alias('u')
    .description('Runs "rush update" command')
    .action(update);

program
    .command('version')
    .alias('v')
    .description('Bumps all standalone RunBotics packages versions. If no option specified, prerelease is bumped by default')
    .option('--major', 'bump major')
    .option('--minor', 'bump minor')
    .option('--patch', 'bump patch')
    .option('--prerelease', 'bump prerelease')
    .option('--no-check', 'do not verify version with develop branch')
    .option('--no-push', 'do not commit and push altered files')
    .action(version);

program.hook('preAction', () => {
    logo();
});

program
    .configureOutput({
        outputError: (text, write) => {
            const [prefix, message] = text.split(': ');
            write(chalk.red(firstCharUpperCase(prefix) + ': ' + firstCharUpperCase(message)));
        },
    });
  
program.showHelpAfterError();
program.parse();
