import { join } from 'path';
import { spawn, getRepositoryPath } from 'src/utils';

const install = async () => {
    const rbRootDir = await getRepositoryPath();
    const configFilePath = join(rbRootDir, 'runbotics');
    await spawn('rush', ['install'], { cwd: configFilePath, shell: true, stdio: 'inherit' });
};

export default install;
