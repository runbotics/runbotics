import chalk from "chalk";
import { exec as nativeExec } from 'child_process';
import { parse } from 'comment-json';
import { promisify } from 'util';

import spawn from './spawn.js';

const exec = promisify(nativeExec)

const getRemoteRbConfig = async () => {
    console.log('Fetching remote develop branch');

    await spawn('git', [ 'fetch', 'origin', 'develop' ], { stdio: 'inherit' })
        .catch(() => {
            console.log(chalk.red('Error: RunBotics config file is invalid'));
            process.exit(1);
        });

    // const remoteConfig = await exec('git show develop:runbotics/common/config/runbotics.json') // TODO: test
    const remoteConfig = await exec('git show develop:runbotics/runbotics-scheduler/package.json')
        .then((data) => parse(data.stdout))
        .catch(() => {
            console.log(chalk.red('Error: Failed to retrieve develop config file'));
            process.exit(1);
        });

    return remoteConfig;
};

export default getRemoteRbConfig;
