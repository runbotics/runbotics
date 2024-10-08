import { BotSystemType } from 'runbotics-common';

const getBotSystem = () => {
    const system = process.platform;
    switch (system) {
        case 'win32':
            return BotSystemType.WINDOWS;
        case 'linux':
            return BotSystemType.LINUX;
        case 'darwin':
            return BotSystemType.MAC;
        default:
            return system.toUpperCase();
    }
};

export default getBotSystem;
