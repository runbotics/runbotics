import chalk from 'chalk';
import inquirer from 'inquirer';

import getLocalRbConfig from './local-config';
import verifyRemoteRbConfig from './remote-config';
import { PRERELEASE_ID, PRERELEASE } from './utils';
import { VersionCommandOptions, VersionOptions } from './types';
import { Emoji } from '../utils/emoji';
import alterFiles from './alter-files';
import versionControl from './version-control';

const { prompt } = inquirer;

const getBumpType = (versionOptions: VersionOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const providedOptions = Object.entries(versionOptions).filter(([_, value]) => value === true);

    if (providedOptions.length > 1) {
        console.log(chalk.red(`${Emoji.error} Error: Options [${providedOptions.map(([key]) => `--${key}`).join(', ')}] cannot be used together`));
        process.exit(1);
    }

    if (providedOptions.length === 0) return PRERELEASE;

    const [selectedOption] = providedOptions[0];
    return selectedOption;
};

const getCurrentVersion = async (check: boolean) => {
    const { localConfig, rbRootDir } = await getLocalRbConfig();

    if (!localConfig.version) {
        console.log(chalk.red(`${Emoji.error} Error: RunBotics config file is invalid`));
        process.exit(1);
    }

    const localVersion = localConfig.version;

    if (!check) {
        console.log(`${Emoji.skip} Skipping remote version sync`);
        return [localVersion, rbRootDir];
    }

    await verifyRemoteRbConfig(localVersion);

    return [localVersion, rbRootDir];
};

const createNewVersion = (version: string, options: VersionOptions) => {
    const [major, minor, patch, prerelease] = version.split('.');
    if (options.major) {
        return `${parseInt(major) + 1}.0.0`;
    }

    if (options.minor) {
        return `${major}.${parseInt(minor) + 1}.0`;
    }

    if (options.patch) {
        const mappedPatch = patch.split('-')[0];
        return `${major}.${minor}.${parseInt(mappedPatch) + 1}`;
    }

    if (!prerelease) return `${major}.${minor}.${patch}-${PRERELEASE_ID}.0`;

    return `${major}.${minor}.${patch}.${parseInt(prerelease) + 1}`;
};

const version = async ({ push, check, ...versionOptions }: VersionCommandOptions) => {
    const bumpType = getBumpType(versionOptions);

    console.log(chalk.bold(`Running RunBotics ${bumpType} version bump\n`));
    const [currentVersion, rbRootDir] = await getCurrentVersion(check);
    const newVersion = createNewVersion(currentVersion, versionOptions);
    console.log(chalk.gray(`\nCurrent version: ${currentVersion}`));
    console.log(chalk.green(`New version:\t ${newVersion}\n`));

    const { isConfirmed } = await prompt([
        { type: 'confirm', message: 'Do you want to continue?', name: 'isConfirmed' },
    ]);

    if (!isConfirmed) {
        process.exit(0);
    }

    console.log('\nAltering config files:');
    await alterFiles(rbRootDir, newVersion);

    if (push) {
        await versionControl(rbRootDir, newVersion);
    } else {
        console.log(`\n${Emoji.skip} Skipping version control actions`);
    }

    console.log(chalk.green.bold(`\nOperation executed successfully ${Emoji.confetti}`));
    process.exit(0);
};

export default version;
