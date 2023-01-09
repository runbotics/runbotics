import { spawn as nativeSpawn } from 'child_process';

const spawn = (command: string, parameters?: string[], options?: any) => new Promise((resolve, reject) => {
    const child = nativeSpawn(command, parameters, options);

    process.on('SIGINT', () => {
        child.kill('SIGINT');
        process.exit(130);
    });

    child.on('close', (code) => {
        resolve(code);
    });

    child.on('error', () => {
        reject();
    });
});

export default spawn;
