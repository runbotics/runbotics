import { Injectable, LoggerService, Optional } from '@nestjs/common';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getEnvValue } from '#utils/envReader';

export enum LoggerType {
    CONSOLE_ONLY = 'consoleOnly',
    CONSOLE_AND_FILE = 'consoleAndFile'
}

export enum LogLevel {
    DEBUG = 'debug',
    VERBOSE = 'verbose',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
    debug: 4,
    verbose: 3,
    info: 2,
    warn: 1,
    error: 0,
};

@Injectable()
export class RunboticsLogger implements LoggerService {
    private static lastTimestamp?: number;
    private static loggerType: LoggerType;
    private static logLevel: LogLevel;
    protected static winstonLogger; // handler for files if files are allowed
    protected static internalConsole: any = RunboticsLogger.createInternalConsole();

    private setLoggerType() {
        const loggerType = getEnvValue('RUNBOTICS_LOGGER');
        if (!loggerType || !Object.values<string>(LoggerType).includes(loggerType)) {
            return LoggerType.CONSOLE_AND_FILE; // default LoggerType value
        } else {
            return loggerType as LoggerType;
        }
    }

    private setLogLevel(): LogLevel {
        const logLevel = getEnvValue('RUNBOTICS_LOGGER_LEVEL');
        if (!logLevel || !Object.keys(LOG_LEVEL_VALUES).includes(logLevel)) {
            return LogLevel.INFO; // default LogLevel value
        } else {
            return logLevel as LogLevel;
        }
    }

    private static createInternalConsole() {
        const internalConsole = {
            info: console.info.bind(console),
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            debug: console.debug.bind(console),
        };

        console.log = function (message?: any, ...optionalParams: any[]) {
            RunboticsLogger.print(LogLevel.INFO, [message, ...optionalParams], 'RunboticsLogger');
        };
        console.info = function (message?: any, ...optionalParams: any[]) {
            RunboticsLogger.print(LogLevel.INFO, [message, ...optionalParams], 'RunboticsLogger');
        };
        console.error = function (message?: any, ...optionalParams: any[]) {
            RunboticsLogger.print(LogLevel.INFO, [message, ...optionalParams], 'RunboticsLogger');
        };

        return internalConsole;
    }

    private static createWinstonLogger() {
        if (RunboticsLogger.loggerType !== LoggerType.CONSOLE_AND_FILE) return undefined;

        const logger = winston.createLogger({
            levels: LOG_LEVEL_VALUES,
            format: winston.format.simple(),
            transports: [
                new DailyRotateFile({
                    dirname: 'logs',
                    level: RunboticsLogger.logLevel,
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

    constructor(
        @Optional() protected context?: string,
        @Optional() private readonly isTimestampEnabled = false
    ) {
        if (RunboticsLogger.loggerType === undefined)
            RunboticsLogger.loggerType = this.setLoggerType();

        if (RunboticsLogger.logLevel === undefined)
            RunboticsLogger.logLevel = this.setLogLevel();

        if (RunboticsLogger.winstonLogger === undefined)
            RunboticsLogger.winstonLogger = RunboticsLogger.createWinstonLogger();
    }

    get module() {
        return this.context ? this.context : 'Nest.JS';
    }

    log(...data: any[]) {
        RunboticsLogger.print(LogLevel.INFO, data, this.module, true);
    }

    error(...data: any[]) {
        RunboticsLogger.print(LogLevel.ERROR, data, this.module, true);
    }

    warn(...data: any[]) {
        RunboticsLogger.print(LogLevel.WARN, data, this.module, true);
    }

    debug(...data: any[]) {
        RunboticsLogger.print(LogLevel.DEBUG, data, this.module, true);
    }

    verbose(...data: any[]) {
        RunboticsLogger.print(LogLevel.VERBOSE, data, this.module, true);
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

    public static print(type: LogLevel, data: any[], context = '', isTimeDiffEnabled = true) {
        let color;
        switch (type) {
            case LogLevel.ERROR:
                color = clc.red;
                break;
            case LogLevel.DEBUG:
                color = clc.magentaBright;
                break;
            case LogLevel.INFO:
                color = clc.green;
                break;
            case LogLevel.WARN:
                color = clc.yellow;
                break;
            case LogLevel.VERBOSE:
                color = clc.cyanBright;
                break;
        }

        const pidMessage = `[Nest] ${process.pid}   - `;
        const colorPidMessage = color(`[Nest] ${process.pid}   - `);
        const contextMessage = context ? `[${context}] ` : '';
        const colorContextMessage = context ? color(`[${context}] `) : '';
        const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);
        const [firstLog, ...rest] = data;
        const timestamp = RunboticsLogger.getTimestamp();
        // this.winstonLogger.log(type == 'error' ? 'error': 'info',  `${pidMessage}${timestamp}   ${contextMessage} ` + firstLog, rest)

        switch (RunboticsLogger.loggerType) {
            case LoggerType.CONSOLE_AND_FILE:
                if (!this.isLevelEnabled(type)) {
                    return;
                }
                this.winstonLogger.log(type, `${pidMessage}${timestamp}   ${contextMessage} ` + firstLog, rest);
                RunboticsLogger.internalConsole[type](
                    `${colorPidMessage}${timestamp}   ${colorContextMessage} ` + firstLog,
                    ...rest,
                    `${timestampDiff}`,
                );
                break;
            case LoggerType.CONSOLE_ONLY:
                if (!this.isLevelEnabled(type)) {
                    return;
                }
                RunboticsLogger.internalConsole.info(
                    `${type}: ${colorPidMessage}${timestamp}   ${colorContextMessage} ` + firstLog,
                    ...rest,
                    `${timestampDiff}`,
                );
                break;
            default:
                if (!this.isLevelEnabled(type)) {
                    return;
                }

                RunboticsLogger.internalConsole[type](
                    `${colorPidMessage}${timestamp}   ${colorContextMessage} ` + firstLog,
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
        const highestLevelValue = LOG_LEVEL_VALUES[RunboticsLogger.logLevel];
        const targetLevelValue = LOG_LEVEL_VALUES[level];
        return targetLevelValue <= highestLevelValue;
    }
}

type ColorTextFn = (text: string) => string;


export const clc = {
    green: (text: string) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
    red: (text: string) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};
