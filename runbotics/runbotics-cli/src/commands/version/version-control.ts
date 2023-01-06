import spawn from './spawn';

const versionControl = async (nextVersion: string) => {
    console.log('Pushing changes to the remote\n');
    await spawn('git', [ 'add', '.' ], { stdio: 'inherit' });
    await spawn('git', [ 'commit', '--no-verify', '-m', `bump app version to ${nextVersion}` ], { stdio: 'inherit' });
    await spawn('git', [ 'push' ], { stdio: 'inherit' });
};

export default versionControl;
