import { ProcessInstanceStatus } from 'runbotics-common';

export const FINISHED_PROCESS_STATUSES = [
    ProcessInstanceStatus.COMPLETED,
    ProcessInstanceStatus.STOPPED,
    ProcessInstanceStatus.ERRORED,
];

export const PLUGIN_PREFIX = 'plugin.';
