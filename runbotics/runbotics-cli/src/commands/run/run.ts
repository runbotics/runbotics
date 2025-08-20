import chalk from 'chalk';
import { join } from 'path';
import { getRepositoryPath, spawn } from 'src/utils';
import { RunCommandOptions, Package } from './types';
import { API_RELATIVE_PATH, BOT_RELATIVE_PATH, SCHEDULER_RELATIVE_PATH, UI_RELATIVE_PATH, LP_RELATIVE_PATH, PROXY_RELATIVE_PATH } from './utils';

const getMonorepoParams = (options?: RunCommandOptions) => {
    if (options?.production) {
        return ['start'];
    }
    
    if (options?.debug) {
        return ['start:debug'];
    }
    
    return ['start:dev'];
};

const startMonorepoPackage = (path: string, options?: RunCommandOptions) => {
    return spawn('rushx', getMonorepoParams(options), { cwd: path, shell: true, stdio: 'inherit' });
};

const run = async (packageArg: Package, options?: RunCommandOptions) => {
    if (options?.debug && options?.production) {
        console.log(chalk.red(`Error: ${chalk.red.bold('--production')} and ${chalk.red.bold('--debug')} options cannot be used together`));
        process.exit(1);
    }

    const rbRootDir = await getRepositoryPath();
    const log = (packageName: string) => {
        console.log(chalk.bold('Running ') + chalk.green.bold(packageName) + chalk.bold(' package\n'));
    };

    switch(packageArg) {
        case 'api':
            log('runbotics-orchestrator');
            await spawn('sh', ['gradlew'], { cwd: join(rbRootDir, API_RELATIVE_PATH), shell: true, stdio: 'inherit' });
            break;
        case 'bot':
            log('runbotics-desktop');
            await startMonorepoPackage(join(rbRootDir, BOT_RELATIVE_PATH), options);
            break;
        case 'scheduler':
            log('runbotics-scheduler');
            await startMonorepoPackage(join(rbRootDir, SCHEDULER_RELATIVE_PATH), options);
            break;
        case 'lp':
            log('runbotics-lp');
            await startMonorepoPackage(join(rbRootDir, LP_RELATIVE_PATH), options);
            break;
        case 'ui':
            log('runbotics-orchestrator-ui');
            await startMonorepoPackage(join(rbRootDir, UI_RELATIVE_PATH), options);
            break;
        case 'proxy':
            log('runbotics-proxy');
            await startMonorepoPackage(join(rbRootDir, PROXY_RELATIVE_PATH), options);
            break;
        default:
            throw new Error(`Unknown package '${packageArg}'. Valid packages are: api, bot, scheduler, lp, ui, proxy`);
    }
};

export default run;
