import PACKAGE from '../../package.json';

const environment = {
    version: PACKAGE.version,
    runboticsEnv: process.env.RUNBOTICS_ENVIRONMENT || 'unknown',
};

export default environment;
