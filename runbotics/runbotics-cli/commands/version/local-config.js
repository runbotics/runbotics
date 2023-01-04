import chalk from "chalk";
import { join } from "path";
import { exec as nativeExec } from 'child_process';
import fs from 'fs-extra';
import { promisify } from 'util';

const { readJsonSync } = fs;
const exec = promisify(nativeExec)

const getLocalRbConfig = async () => {
    await exec('git config -l | grep remote.origin.url=https://github.com/runbotics/runbotics.git')
        .catch(() => {
            console.log(chalk.red.bgBlack('Error: This command can be run only inside RunBotics repository'));
            process.exit(1);
        });

    const rbRootDir = await exec('git rev-parse --show-toplevel')
        .then((data) => data.stdout.trim())
        .catch(() => {
            console.log(chalk.red.bgBlack('Error: Failed to retrieve repository location'));
            process.exit(1);
        });

    const rbConfigPath = join(rbRootDir, 'runbotics', 'common', 'config', 'runbotics.json');

    const localConfig = readJsonSync(rbConfigPath);

    return { localConfig, rbRootDir };
}

export default getLocalRbConfig;
