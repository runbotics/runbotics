import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ISubscription } from '../bpm/Runtime';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import * as fs from 'fs';
import dayjs from 'dayjs';
import { RunboticsLogger } from 'src/logger/RunboticsLogger';
import { ServerConfigService } from 'src/config/ServerConfigService';
import readLine from 'readline';
import { BotWsMessage } from 'runbotics-common';

@Injectable()
export class WebsoketLogs {
    constructor(
        @InjectIoClientProvider() private readonly io: IoClient,
        private serverConfigService: ServerConfigService,
    ) {}

    private readonly logger = new RunboticsLogger(WebsoketLogs.name);
    readonly DATE_FORMAT = 'YYYY-MM-DD-HH';

    collectLogs = () => {
        function censor(censor) {
            let i = 0;
            return function (key, value) {
                if (i !== 0 && typeof censor === 'object' && typeof value == 'object' && censor == value) {
                    return '[Circular]';
                }
                if (i >= 29) {
                    // seems to be a harded maximum of 30 serialized objects?
                    return '[Unknown]';
                }
                ++i; // so we know we aren't using the original object anymore
                return value;
            };
        }

        const log = console.log.bind(console);
        const error = console.error.bind(console);

        const sendToServer = (method: string, args: any[]) => {
            const log = {
                method: method,
                data: args,
            };
            try {
                this.io.emit('log', JSON.stringify(log, censor(log)));
            } catch (e) {
                error('Error sending logs to server', e);
                try {
                    this.io.emit(
                        'logs',
                        JSON.stringify({
                            method: 'error',
                            data: ['Error sending logs to server: '],
                        }),
                    );
                } catch (e) {} // todo :OO
            }
        };
        console.log = (...args: any[]) => {
            log(...args);
            sendToServer('log', args);
        };

        const info = console.info.bind(console);
        console.info = (...args: any[]) => {
            log(...args);
        };

        console.error = (...args: any[]) => {
            log(...args);
        };

        const debug = console.debug.bind(console);
        console.debug = (...args: any[]) => {
            log(...args);
        };

        return {
            unsubscribe() {
                // @ts-ignore
                // Unhook(window.console);
                console.log = log;
                console.info = info;
                console.error = error;
                console.debug = debug;
                // // window.console = originalConsole;
            },
        } as ISubscription;
    };

    // @Cron('*/5 * * * *')
    async sheduledSendingLogs() {
        if (!this.serverConfigService.logger || this.serverConfigService.logger !== 'winston') return;

        const path = './logs';
        const file = `${path}/application-${dayjs().format(this.DATE_FORMAT)}.log`;
        if (!fs.existsSync(file)) {
            this.logger.error(`File ${file} does not exist. Can't update the logs`);
            return;
        }

        const fileStream = fs.createReadStream(file);
        const logsArray = [];

        const rl = readLine.createInterface({
            input: fileStream,
            output: process.stdout,
            terminal: false,
        });

        rl.on('line', (logsText) => {
            logsArray.push(logsText + '\n');
        });

        rl.on('close', () => {
            const latestLogs = logsArray.slice(-100);
            const content = latestLogs.reduce((previousValue, currentValue) => previousValue + currentValue);

            this.io.emit(BotWsMessage.LOG, content);
        });
    }
}
