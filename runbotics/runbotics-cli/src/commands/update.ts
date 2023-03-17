import { join } from 'path';
import { spawn, getRepositoryPath } from 'src/utils';

const update = async () => {
    const rbRootDir = await getRepositoryPath();
    const configFilePath = join(rbRootDir, 'runbotics');
    await spawn('rush', ['update'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
};

export default update;
