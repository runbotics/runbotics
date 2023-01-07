import chalk from 'chalk';
import { join } from 'path';
import { exec as nativeExec } from 'child_process';
import fs from 'fs-extra';
import { promisify } from 'util';

import { RUNBOTICS_CONFIG_RELATIVE_PATH } from './utils';
import getRepositoryPath from '../utils/repository-path';
import { Emoji } from '../utils/emoji';

const { readJsonSync } = fs;
const exec = promisify(nativeExec);

const getLocalRbConfig = async () => {
    const rbRootDir = await getRepositoryPath();

    await exec('git diff --quiet HEAD')
        .catch(() => {
            console.log(chalk.red(`${Emoji.error} Error: Commit your changes before bumping app version`));
            process.exit(1);
        });

    const rbConfigPath = join(rbRootDir, RUNBOTICS_CONFIG_RELATIVE_PATH);

    try {
        const localConfig = readJsonSync(rbConfigPath);
        return { localConfig, rbRootDir };
    } catch (e: any) {
        const message = e.code === 'ENOENT' ? ` (No such file like "${rbConfigPath}")` : undefined;
        throw new Error(`${Emoji.error} Error: Could not find global config file${message ?? ''}`);
    }
};

export default getLocalRbConfig;
