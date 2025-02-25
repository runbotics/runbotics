import path from 'path';
import { ProcessInstanceStatus } from 'runbotics-common';

export const FINISHED_PROCESS_STATUSES = [
    ProcessInstanceStatus.COMPLETED,
    ProcessInstanceStatus.STOPPED,
    ProcessInstanceStatus.ERRORED,
];

export const PLUGIN_PREFIX = 'plugin.';

export const BOT_PLUGIN_DIR = path.join('bot', 'dist', 'index.cjs');

export enum MODULE_TYPE {
    PLUGIN = 'runbotics-plugins',
    ACTIONS = 'runbotics-actions',
}
