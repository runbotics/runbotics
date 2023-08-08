import { BotSystem } from 'runbotics-common';

const botSystem = () => {
    const system = process.platform;
    switch (system) {
        case 'win32':
            return BotSystem.WINDOWS;
        case 'linux':
            return BotSystem.LINUX;
        default:
            return system.toUpperCase();
    }
};

export default botSystem;
