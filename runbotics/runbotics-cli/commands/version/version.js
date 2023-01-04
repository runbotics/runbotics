import chalk from "chalk";
import figlet from 'figlet';
import { join } from "path";
import { stringify } from 'comment-json';
import fs from 'fs-extra';
import inquirer from 'inquirer';

import getLocalRbConfig from './local-config.js';
import getRemoteRbConfig from './remote-config.js';
import spawn from './spawn.js';
import { PRERELEASE_ID, CONFIGS_RELATIVE_PATHS_MAP, RUNBOTICS_CONFIG_RELATIVE_PATH } from './utils.js';

const { readJsonSync, writeFileSync } = fs;
const { prompt } = inquirer;

const getCurrentVersion = async (check) => {
    const { localConfig, rbRootDir } = await getLocalRbConfig();

    if (!localConfig.version) {
        console.log(chalk.red('Error: RunBotics config file is invalid'));
        process.exit(1);
    }

    const localVersion = localConfig.version;

    console.log(chalk.green(`Current version: ${localVersion}`));

    if (!check) return [ localVersion, rbRootDir ];

    const remoteConfig = await getRemoteRbConfig();

    if (!remoteConfig.version) {
        console.log(chalk.red('Error: RunBotics remote config file is invalid'));
        process.exit(1);
    }

    const remoteVersion = remoteConfig.version;

    if (localVersion !== remoteVersion) {
        console.log(chalk.red('Error: Your branch differs remote develop, rebase latest changes'));
        process.exit(1);
    }

    return [ localVersion, rbRootDir ];
}

const createNextVersion = (version, options) => {
    const [ major, minor, patch, prerelease ] = version.split('.');
    if (options.major) {
        return `${parseInt(major) + 1}.0.0`;
    }

    if (options.minor) {
        return `${major}.${parseInt(minor) + 1}.0`;
    }

    if (options.patch) {
        const mappedPatch = patch.split('-')[ 0 ];
        return `${major}.${minor}.${parseInt(mappedPatch) + 1}`;
    }

    if (!prerelease) return `${major}.${minor}.${patch}-${PRERELEASE_ID}.0`;

    return `${major}.${minor}.${patch}.${parseInt(prerelease) + 1}`;
};

const overrideJsonVersion = (path, version) => {
    const original = readJsonSync(path);
    const newConfig = { ...original, version };
    writeFileSync(path, stringify(newConfig, null, 4));
};

const version = async ({ push, check, ...versionOptions }) => {
    console.log(figlet.textSync("RunBotics"));

    console.log(chalk.bold('Running RunBotics version bump\n'));

    const [ currentVersion, rbRootDir ] = await getCurrentVersion(check);

    const nextVersion = createNextVersion(currentVersion, versionOptions);

    console.log(chalk.blue(`Next version:\t ${nextVersion}\n`));

    const { isConfirmed } = await prompt([
        { type: 'confirm', message: 'Do you want to continue?', name: 'isConfirmed' },
    ]);

    if (!isConfirmed) {
        process.exit(0);
    }

    console.log('\nAltering config files\n');

    for (const [ key, value ] of CONFIGS_RELATIVE_PATHS_MAP.entries()) {
        const absolutePath = join(rbRootDir, value);
        try {
            overrideJsonVersion(absolutePath, nextVersion);
        } catch (e) {
            const message = e.code === 'ENOENT' ? ` (No such file like "${absolutePath}")` : undefined;
            console.log(chalk.red(`Error: Could not overwrite ${key} version${message ? message : ''}`));
            process.exit(1);
        }
    }

    await spawn('sh', [ 'gradlew', 'setVersion', `-PnewVersion=${nextVersion}` ], { cwd: join(rbRootDir, 'runbotics-orchestrator'), stdio: 'inherit' })
        .catch(() => {
            process.exit(1);
        });

    try {
        overrideJsonVersion(join(rbRootDir, RUNBOTICS_CONFIG_RELATIVE_PATH), nextVersion);
    } catch (e) {
        const message = e.code === 'ENOENT' ? ` (No such file like "${absolutePath}")` : undefined;
        console.log(chalk.red(`Error: Could not overwrite RunBotics config version${message ? message : ''}`));
        process.exit(1);
    }

    console.log(chalk.green('\nVersion overwritten'));

    if (push) {
        console.log('Pushing changes to the remote\n');
        spawnSync('git', [ 'add', '.' ], { stdio: 'inherit' });
        spawnSync('git', [ 'commit', '--no-verify', '-m', `bump app version to ${nextVersion}` ], { stdio: 'inherit' });
        spawnSync('git', [ 'push' ], { stdio: 'inherit' });
    }

    console.log(chalk.green('\nOperation executed successfully'));
    process.exit(0);
};

export default version;
