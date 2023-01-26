import { Injectable } from '@nestjs/common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import readLine from 'readline';
import { BotWsMessage } from 'runbotics-common';
import * as fs from 'fs';
import dayjs from 'dayjs';

import { RunboticsLogger } from '#logger';
import { ServerConfigService } from '#config';

import { ISubscription } from '../bpm/runtime';

@Injectable()
export class WebsocketLogsService {
    private readonly logger = new RunboticsLogger(WebsocketLogsService.name);
    readonly DATE_FORMAT = 'YYYY-MM-DD-HH';

    constructor(
        @InjectIoClientProvider() private readonly io: IoClient,
        private serverConfigService: ServerConfigService,
    ) {}

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
                this.io.emit(BotWsMessage.LOG, JSON.stringify(log, censor(log)));
            } catch (e) {
                this.logger.error('Error sending logs to server', e);
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
