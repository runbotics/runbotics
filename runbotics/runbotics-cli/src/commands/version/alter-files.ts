import chalk from 'chalk';
import { join } from 'path';
import { stringify } from 'comment-json';
import { Listr } from 'listr2';
import fs from 'fs-extra';

import { spawn, Emoji } from 'src/utils';
import { MONOREPO_CONFIGS_RELATIVE_PATHS, RUNBOTICS_CONFIG_RELATIVE_PATH, LISTR_RENDERER_OPTIONS } from './utils';

const { readJsonSync, writeFileSync } = fs;

const overrideJsonVersion = (path: string, version: string) => {
    const original = readJsonSync(path);
    const newConfig = { ...original, version };
    writeFileSync(path, stringify(newConfig, null, 4));
};

const alterFiles = async (rbRootDir: string, newVersion: string) => {
    const alterJob = new Listr([
        ...MONOREPO_CONFIGS_RELATIVE_PATHS.map(config => ({
            title: config.name,
            task: () => {
                const absolutePath = join(rbRootDir, config.path);
                try {
                    overrideJsonVersion(absolutePath, newVersion);
                } catch (e: any) {
                    const message = e.code === 'ENOENT' ? ` (No such file like "${absolutePath}")` : undefined;
                    throw new Error(chalk.red(`${Emoji.error} Error: Could not overwrite ${config.name} version${message ?? ''}`));
                }
            },
        })),
        {
            title: 'orchestrator',
            task: async () => {
                const absolutePath = join(rbRootDir, 'runbotics-orchestrator/build.gradle');

                const file = fs.readFileSync(absolutePath, 'utf-8');

                const expr = /version = ".+"/;
                const newFile = file.replace(expr, 'version = "' + newVersion + '"');
                fs.writeFileSync(absolutePath, newFile, { encoding: 'utf-8' });
            },
        },
        {
            title: 'global',
            task: () => {
                const rbConfigAbsolutePath = join(rbRootDir, RUNBOTICS_CONFIG_RELATIVE_PATH);

                try {
                    overrideJsonVersion(rbConfigAbsolutePath, newVersion);
                } catch (e: any) {
                    const message = e.code === 'ENOENT' ? ` (No such file like "${rbConfigAbsolutePath}")` : undefined;
                    throw new Error(chalk.red(`${Emoji.error} Error: Could not overwrite RunBotics config version${message ?? ''}`));
                }
            },
        }
    ], { exitOnError: false, concurrent: true, rendererOptions: { ...LISTR_RENDERER_OPTIONS, showErrorMessage: true } });

    await alterJob.run()
        .catch(() => {
            console.log(chalk.red(`\n${Emoji.error} Error: Not all files have been altered. Skipping further actions`));
            process.exit(1);
        });
    
    if (alterJob.err.length > 0) {
        console.log(chalk.red(`\n${Emoji.error} Error: Not all files have been altered. Skipping further actions`));
        process.exit(1);
    }
};

export default alterFiles;
