import { LogLevel } from './logger.types';

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
    debug: 4,
    verbose: 3,
    info: 2,
    warn: 1,
    error: 0,
};

export const getLogColor = (type: LogLevel) => {
    switch (type) {
        case 'error':
            return color.red;
        case 'debug':
            return color.magentaBright;
        case 'info':
            return color.green;
        case 'warn':
            return color.yellow;
        case 'verbose':
            return color.cyanBright;
    }
};

const color = {
    green: (text: string) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
    red: (text: string) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};