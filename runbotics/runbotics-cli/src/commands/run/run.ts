import chalk from 'chalk';
import { join } from 'path';
import getRepositoryPath from '../utils/repository-path';
import spawn from '../version/spawn';
import { RunCommandOptions, Package } from './types';
import { API_RELATIVE_PATH, BOT_RELATIVE_PATH, SCHEDULER_RELATIVE_PATH, UI_RELATIVE_PATH } from './utils';

const getMonorepoParams = (options?: RunCommandOptions) => {
    if (options?.dev) {
        return ['start:dev'];
    }

    if (options?.debug) {
        return ['start:debug'];
    }

    return ['start'];
};

const startMonorepoPackage = (path: string, options?: RunCommandOptions) => {
    return spawn('rushx', getMonorepoParams(options), { cwd: path, shell: true, stdio: 'inherit' });
};

const run = async (packageArg: Package, options?: RunCommandOptions) => {
    if (options?.debug && options?.dev) {
        console.log(chalk.red(`Error: ${chalk.red.bold('--dev')} and ${chalk.red.bold('--debug')} options cannot be used together`));
        process.exit(1);
    }

    const rbRootDir = await getRepositoryPath();
    const log = (packageName: string) => {
        console.log(chalk.bold('Running ') + chalk.green.bold(packageName) + chalk.bold(' package\n'));
    };

    switch(packageArg) {
        case 'api':
            log('runbotics-orchestrator');
            await spawn('sh', ['gradlew', '-x', 'webapp'], { cwd: join(rbRootDir, API_RELATIVE_PATH), shell: true, stdio: 'inherit' });
        case 'bot':
            log('runbotics-desktop');
            await startMonorepoPackage(join(rbRootDir, BOT_RELATIVE_PATH), options);
        case 'scheduler':
            log('runbotics-scheduler');
            await startMonorepoPackage(join(rbRootDir, SCHEDULER_RELATIVE_PATH), options);
        default:
            log('runbotics-orchestrator-ui');
            await startMonorepoPackage(join(rbRootDir, UI_RELATIVE_PATH), options);
    }
};

export default run;
