import chalk from 'chalk';
import { exec as nativeExec } from 'child_process';
import { promisify } from 'util';
import { Emoji } from './emoji';

const exec = promisify(nativeExec);

const getRepositoryPath = async () => {
    await exec('git config -l | grep remote.origin.url=https://github.com/runbotics/runbotics.git')
        .catch(() => {
            console.log(chalk.red(`${Emoji.error} Error: This command can be run only inside RunBotics repository`));
            process.exit(1);
        });

    return exec('git rev-parse --show-toplevel')
        .then((data) => data.stdout.trim())
        .catch(() => {
            console.log(chalk.red(`${Emoji.error} Error: Failed to retrieve repository location`));
            process.exit(1);
        });
};

export default getRepositoryPath;
