import chalk from 'chalk';
import { exec as nativeExec } from 'child_process';
import { parse } from 'comment-json';
import { Listr } from 'listr2';
import { promisify } from 'util';

import { Emoji } from '../utils/emoji';
import spawn from './spawn';
import { containsVersion, LISTR_RENDERER_OPTIONS } from './utils';

const exec = promisify(nativeExec);

const VERSIONS_VERIFICATION_STEP = 'Veryfing versions compatibility';

const getRemoteRbConfig = async (localVersion: string) => {
    const job = new Listr<{ remoteVersion: string }>([{
        title: 'Fetching origin/develop branch',
        task: () => spawn('git', [ 'fetch', 'origin', 'develop' ])
            .catch(() => {
                throw new Error(`\n${Emoji.error} Error: Failed to fetch latest origin/develop from remote`);
            }),
    },
    {
        title: 'Persisting latest app version',
        task: async (ctx) => {        
            const remoteConfig = await exec('git show origin/develop:runbotics/common/config/runbotics.json')
                .then((data) => parse(data.stdout))
                .catch(() => {
                    throw new Error(`\n${Emoji.error} Error: Failed to retrieve develop config file`);
                });

            if (!containsVersion(remoteConfig)) {
                throw new Error(`\n${Emoji.error} Error: RunBotics remote config file is invalid`);
            }

            ctx.remoteVersion = remoteConfig.version;
        },
    },
    {
        title: VERSIONS_VERIFICATION_STEP,
        task: ({ remoteVersion }) => {
            if (localVersion !== remoteVersion) {
                throw new Error(`\n${Emoji.error} Error: Your branch differs from origin/develop. Rebase latest changes`);
            }
        },
    }], { rendererOptions: LISTR_RENDERER_OPTIONS });

    await job.run()
        .catch((error) => {
            if (job.err[0]?.task.initialTitle === VERSIONS_VERIFICATION_STEP) {
                console.log(`\nOrigin: ${job.ctx.remoteVersion}`);
                console.log(chalk.red(`Local:\t${localVersion}`));
            }
            console.log(chalk.red(error.message));
            process.exit(1);
        });
};

export default getRemoteRbConfig;
