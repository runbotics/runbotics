import chalk from "chalk";
import figlet from 'figlet';
import { join } from "path";
import { exec as nativeExec, spawnSync } from 'child_process';
import { parse, stringify } from 'comment-json';
import fs from 'fs-extra';
import { promisify } from 'util';
import inquirer from 'inquirer';

import getLocalRbConfig from './local-config.js';
import getRemoteRbConfig from './remote-config.js';

const { readJsonSync, writeJSONSync, writeFileSync } = fs;
const { prompt } = inquirer;
const exec = promisify(nativeExec)

const PRERELEASE_ID = 'SNAPSHOT';
const SCHEDULER_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-scheduler', 'package.json');
const UI_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-orchestrator-ui', 'package.json');
const BOT_CONFIG_RELATIVE_PATH = join('runbotics', 'runbotics-desktop', 'package.json');
const API_CONFIG_RELATIVE_PATH = join('runbotics-orchestrator', 'package.json');

const CONFIGS_RELATIVE_PATHS_MAP = new Map([
    [ 'scheduler', SCHEDULER_CONFIG_RELATIVE_PATH ],
    [ 'orchestrator-ui', UI_CONFIG_RELATIVE_PATH ],
    [ 'desktop', BOT_CONFIG_RELATIVE_PATH ],
    [ 'orchestrator', API_CONFIG_RELATIVE_PATH ],
]);

// 1 /- sprawdz czy w repo, sprawdz czy cos jest do zacommitowania, pobierz wersje z configu, jesli nie ma to rzuc blad
// 2 /- git fetch developa
// 3 /- pobierz wersje z developa i porownaj z aktualna, jesli sie nie zgadza to nakaż zrobić rebase
// 4 /- w zaleznosci od opcji utwórz nową wersję
// 5 - nadpisz wersje we wszystkich plikach
// 6 - commit i push

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

const overridePackageJson = (path, version) => {
    const original = readJsonSync(path);
    const newConfig = { ...original, version };
    writeFileSync(path, stringify(newConfig, null, 4));
};

const version = async ({ check, ...versionOptions }) => {
    console.log(figlet.textSync("RunBotics"));

    console.log(chalk.bold('Running RunBotics version bump\n'));

    const [ currentVersion, rbRootDir ] = await getCurrentVersion(check);

    const nextVersion = createNextVersion(currentVersion, versionOptions);

    console.log(chalk.blue(`Next version: ${nextVersion}\n`));

    const { isConfirmed } = await prompt([
        { type: 'confirm', message: 'Do you want to continue?', name: 'isConfirmed' },
    ]);

    if (!isConfirmed) {
        process.exit(0);
    }

    for (const [ key, value ] of CONFIGS_RELATIVE_PATHS_MAP.entries()) {
        const absolutePath = join(rbRootDir, value);
        try {
            overridePackageJson(absolutePath, nextVersion);
        } catch (e) {
            const message = e.code === 'ENOENT' ? ` (No such file like "${absolutePath}")` : undefined;
            console.log(chalk.red(`Error: Could not overwrite ${key} version${message ? message : ''}`));
            process.exit(1);
        }
    }

    console.log(chalk.green('Version overwritten'));
    console.log('Pushing changes to the remote');

    spawnSync('git', [ 'add', '.' ], { stdio: 'inherit' });
    spawnSync('git', [ 'commit', '--no-verify', `-m "bump app version to ${nextVersion}"` ], { stdio: 'inherit' });
    spawnSync('git', [ 'push' ], { stdio: 'inherit' });

    console.log(chalk.green('Operation executed successfully'));
    process.exit(0);
};

export default version;
