import { program } from 'commander';
import { default as major } from './commands/major';
import { default as minor } from './commands/minor';
import { default as patch } from './commands/patch';
import { default as prerelease } from './commands/prerelease';

program
    .command('major')
    .description('')
    .action(major);

program
    .command('minor')
    .description('')
    .action(minor);

program
    .command('patch')
    .description('')
    .action(patch);

program
    .command('prerelease')
    .description('')
    .action(prerelease);
