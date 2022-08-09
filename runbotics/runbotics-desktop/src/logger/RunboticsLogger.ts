import { Injectable, Logger, LoggerService, OnModuleInit, Optional, Scope } from '@nestjs/common';
import winston from 'winston';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import DailyRotateFile from 'winston-daily-rotate-file';
import { parentPort } from 'worker_threads';

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
    debug: 4,
    verbose: 3,
    info: 2,
    warn: 1,
    error: 0,
};

export declare type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class RunboticsLogger implements LoggerService, OnModuleInit {
    private static lastTimestamp?: number;
    protected static winstonLogger = RunboticsLogger.createWinstonLogger('info');
    protected static internalConsole: any = RunboticsLogger.createInternalConsole();
    private static createInternalConsole() {
        const internalConsole = {
            info: console.info.bind(console),
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            debug: console.debug.bind(console),
        };

        console.log = function (message?: any, ...optionalParams: any[]) {
            RunboticsLogger.print('info', [message, ...optionalParams], 'RunboticsLogger');
        };
        console.info = function (message?: any, ...optionalParams: any[]) {
            RunboticsLogger.print('info', [message, ...optionalParams], 'RunboticsLogger');
        };
        console.error = function (message?: any, ...optionalParams: any[]) {
            RunboticsLogger.print('error', [message, ...optionalParams], 'RunboticsLogger');
        };

        return internalConsole;
    }
    private static createWinstonLogger(level: string) {
        const logger = winston.createLogger({
            levels: LOG_LEVEL_VALUES,
            format: winston.format.simple(),
            transports: [
                new DailyRotateFile({
                    dirname: 'logs',
                    level: level,
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    json: false,
                }),
            ],
        });
        return logger;
    }

    constructor(@Optional() protected context?: string, @Optional() private readonly isTimestampEnabled = false) {}

    onModuleInit() {
        let logLevel;
        if (!process.env.RUNBOTICS_LOGGER_LEVEL) {
            console.log('No log level found, back to default: info');
            logLevel = 'info';
        } else {
            console.log('Log level from env: ' + process.env.RUNBOTICS_LOGGER_LEVEL);
            logLevel = process.env.RUNBOTICS_LOGGER_LEVEL;
        }

        RunboticsLogger.winstonLogger = RunboticsLogger.createWinstonLogger(logLevel);
    }

    get module() {
        return this.context ? this.context : 'Nest.JS';
    }

    log(...data: any[]) {
        RunboticsLogger.print('info', data, this.module, true);
    }

    error(...data: any[]) {
        RunboticsLogger.print('error', data, this.module, true);
    }

    warn(...data: any[]) {
        RunboticsLogger.print('warn', data, this.module, true);
    }

    debug(...data: any[]) {
        RunboticsLogger.print('debug', data, this.module, true);
    }

    verbose(...data: any[]) {
        RunboticsLogger.print('verbose', data, this.module, true);
    }

    static getTimestamp() {
        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
        return new Date(Date.now()).toLocaleString(undefined, localeStringOptions as Intl.DateTimeFormatOptions);
    }

    public static print(type: LogLevel, data: any[], context = '', isTimeDiffEnabled: boolean = true) {
        let color;
        switch (type) {
            case 'error':
                color = clc.red;
                break;
            case 'debug':
                color = clc.magentaBright;
                break;
            case 'info':
                color = clc.green;
                break;
            case 'warn':
                color = clc.yellow;
                break;
            case 'verbose':
                color = clc.cyanBright;
                break;
        }

        const pidMessage = color(`[Nest] ${process.pid}   - `);
        const contextMessage = context ? color(`[${context}] `) : '';
        const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);
        const [firstLog, ...rest] = data;
        const timestamp = RunboticsLogger.getTimestamp();
        // this.winstonLogger.log(type == 'error' ? 'error': 'info',  `${pidMessage}${timestamp}   ${contextMessage} ` + firstLog, rest)

        switch (process.env.RUNBOTICS_LOGGER) {
            case 'winston':
                this.winstonLogger.log(type, `${pidMessage}${timestamp}   ${contextMessage} ` + firstLog, rest);
                RunboticsLogger.internalConsole[type](
                    `${pidMessage}${timestamp}   ${contextMessage} ` + firstLog,
                    ...rest,
                    `${timestampDiff}`,
                );
                break;
            case 'electron':
                if (!this.isLevelEnabled(type)) {
                    return;
                }
                RunboticsLogger.internalConsole.info(
                    `${type}: ${pidMessage}${timestamp}   ${contextMessage} ` + firstLog,
                    ...rest,
                    `${timestampDiff}`,
                );
                break;
            default:
                if (!this.isLevelEnabled(type)) {
                    return;
                }

                RunboticsLogger.internalConsole[type](
                    `${pidMessage}${timestamp}   ${contextMessage} ` + firstLog,
                    ...rest,
                    `${timestampDiff}`,
                );
                break;
        }
    }

    private static updateAndGetTimestampDiff(isTimeDiffEnabled?: boolean): string {
        const includeTimestamp = RunboticsLogger.lastTimestamp && isTimeDiffEnabled;
        const result = includeTimestamp ? clc.yellow(` +${Date.now() - RunboticsLogger.lastTimestamp}ms`) : '';
        RunboticsLogger.lastTimestamp = Date.now();
        return result;
    }

    private static printStackTrace(trace: string) {
        if (!trace) {
            return;
        }
        process.stderr.write(`${trace}\n`);
    }

    static isLevelEnabled(level: LogLevel): boolean {
        // const logLevels = RunboticsLogger.logLevels;
        // return isLogLevelEnabled(level, logLevels);
        return true;
    }
}

/**
 * Checks if target level is enabled.
 * @param targetLevel target level
 * @param logLevels array of enabled log levels
 */
export function isLogLevelEnabled(targetLevel: LogLevel, logLevels: LogLevel[] | undefined): boolean {
    if (!logLevels || (Array.isArray(logLevels) && logLevels?.length === 0)) {
        return false;
    }
    if (logLevels.includes(targetLevel)) {
        return true;
    }
    const highestLogLevelValue = logLevels.map((level) => LOG_LEVEL_VALUES[level]).sort((a, b) => b - a)?.[0];

    const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
    return targetLevelValue >= highestLogLevelValue;
}

type ColorTextFn = (text: string) => string;


export const clc = {
    green: (text: string) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
    red: (text: string) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};
