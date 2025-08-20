import { join } from 'path';
import { getRepositoryPath, spawn } from 'src/utils';
import { Operation } from './types';

const docker = async (operation: Operation) => {
    const rbRootDir = await getRepositoryPath();
    const configFilePath = join(rbRootDir, 'runbotics');

    switch(operation) {
        case 'up':
            await spawn('docker-compose', ['up', '-d'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
            break;
        case 'pull':
            await spawn('docker-compose', ['pull'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
            break;
        case 'down':
            await spawn('docker-compose', ['down'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
            break;
        default:
            await spawn('docker-compose', ['pull'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
            await spawn('docker-compose', ['up', '-d'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
    }
};

export default docker;
