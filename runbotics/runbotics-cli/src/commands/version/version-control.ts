import chalk from 'chalk';
import { Listr } from 'listr2';
import { Emoji } from '../utils/emoji';
import spawn from './spawn';
import { LISTR_RENDERER_OPTIONS } from './utils';

const versionControl = async (rbRootDir: string, nextVersion: string) => {
    console.log('\nVersion control:');
    const job = new Listr([{
            title: 'Staging changes',
            task: () => spawn('git', [ 'add', '.' ], { cwd: rbRootDir })
                .catch(() => {
                    throw new Error(`\n${Emoji.error} Error: Failed to stage new version changes`);
                }),
        },
        {
            title: 'Committing',
            task: () => spawn('git', [ 'commit', '--no-verify', '-m', `chore: :pushpin: bump app version to ${nextVersion}` ])
                .catch(() => {
                    throw new Error(`\n${Emoji.error} Error: Failed commit new version changes`);
                }),
        },
        {
            title: 'Pushing',
            task: () => spawn('git', [ 'push' ])
                .catch(() => {
                    throw new Error(`\n${Emoji.error} Error: Failed to push version changes`);
                }),
    }], { rendererOptions: LISTR_RENDERER_OPTIONS });

    await job.run()
        .catch((error) => {
            console.log(chalk.red(error.message));
            process.exit(1);
        });
};

export default versionControl;
