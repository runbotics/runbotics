#! /usr/bin/env node

import chalk from 'chalk';
import { Argument, program } from 'commander';

import version from './commands/version';
import run from './commands/run';
import logo from './commands/logo';
import firstCharUpperCase from './commands/utils/first-upper';

program
    .name('rb')
    .usage('[command] [options] <package>')
    .version('1.0.0');

program
    .description('Runs selected package')
    .addArgument(new Argument('<package>', 'name of the package').choices(['ui', 'api', 'scheduler', 'bot']))
    .option('-d, --dev', 'development mode')
    .option('--debug', 'debug mode')
    .action(run);

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
})

program
    .configureOutput({
        outputError: (text, write) => {
            const [prefix, message] = text.split(': ');
            write(chalk.red(firstCharUpperCase(prefix) + ': ' + firstCharUpperCase(message)));
        },
    });
  
program.showHelpAfterError();
program.parse();
