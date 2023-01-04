import { spawn as nativeSpawn } from 'child_process';

const spawn = (command, parameters, options) => new Promise((resolve, reject) => {
    const child = nativeSpawn(command, parameters, options);

    child.on('close', () => {
        resolve();
    });

    child.on('error', (e) => {
        reject();
    });
});

export default spawn;
