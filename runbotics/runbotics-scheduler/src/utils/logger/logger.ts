import { LoggerService, OnModuleInit, Optional } from '@nestjs/common';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { getLogColor, LOG_LEVEL_VALUES } from './logger.utils';
import { LogLevel } from './logger.types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export class Logger implements LoggerService, OnModuleInit {
    protected static winstonLogger = Logger.createWinstonLogger('info');
    protected static internalConsole = Logger.createInternalConsole();

    constructor(
        @Optional() protected context?: string,
    ) { }

    onModuleInit() {
        let logLevel;
        if (!process.env.RUNBOTICS_LOGGER_LEVEL) {
            console.log('No log level found, back to default: info');
            logLevel = 'info';
        } else {
            console.log('Log level from env: ' + process.env.RUNBOTICS_LOGGER_LEVEL);
            logLevel = process.env.RUNBOTICS_LOGGER_LEVEL;
        }

        Logger.winstonLogger = Logger.createWinstonLogger(logLevel);
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

    private static createInternalConsole() {
        const internalConsole = {
            info: console.info.bind(console),
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            debug: console.debug.bind(console),
        };

        console.log = function (message?: any, ...optionalParams: any[]) {
            Logger.print('info', [message, ...optionalParams], 'RunboticsLogger');
        };
        console.info = function (message?: any, ...optionalParams: any[]) {
            Logger.print('info', [message, ...optionalParams], 'RunboticsLogger');
        };
        console.error = function (message?: any, ...optionalParams: any[]) {
            Logger.print('error', [message, ...optionalParams], 'RunboticsLogger');
        };

        return internalConsole;
    }

    get module() {
        return this.context ? this.context : 'Nest.JS';
    }

    log(...data: any[]) {
        Logger.print('info', data, this.module);
    }

    error(...data: any[]) {
        Logger.print('error', data, this.module);
    }

    warn(...data: any[]) {
        Logger.print('warn', data, this.module);
    }

    debug(...data: any[]) {
        Logger.print('debug', data, this.module);
    }

    verbose(...data: any[]) {
        Logger.print('verbose', data, this.module);
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

    public static print(type: LogLevel, data: any[], context = '') {
        const color = getLogColor(type);

        const pidMessage = `[Nest] ${process.pid}   - `;
        const contextMessage = context ? `[${context}] ` : '';
        const [message, ...rest] = data;
        const timestamp = Logger.getTimestamp();

        this.winstonLogger.log(type, `${pidMessage}${timestamp}   ${contextMessage} ` + message, rest);
        Logger.internalConsole[type](
            `${color(pidMessage)}${timestamp}   ${color(contextMessage)} ` + message, ...rest,
        );
    }
}

