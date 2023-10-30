import { BotSystem } from 'runbotics-common';

const getBotSystem = () => {
    const system = process.platform;
    switch (system) {
        case 'win32':
            return BotSystem.WINDOWS;
        case 'linux':
            return BotSystem.LINUX;
        case 'darwin':
            return BotSystem.MAC;
        default:
            return system.toUpperCase();
    }
};

export default getBotSystem;
