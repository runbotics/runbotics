#! /usr/bin/env node

import { program } from 'commander';
import version from './commands/version/index.js';

program
    .command('version')
    .description('Bumps all standalone RunBotics packages versions. If no option specified, prerelease is bumped by default.')
    .option('--major', 'bump major')
    .option('--minor', 'bump minor')
    .option('--patch', 'bump patch')
    .option('--prerelease', 'bump prerelease')
    .option('--no-check', 'do not verify version with develop branch')
    .option('--no-push', 'do not commit and push altered files')
    .action(version);

program.showHelpAfterError();
program.parse();
