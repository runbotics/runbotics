import { WsMessage } from 'runbotics-common';

import { ProcessInstanceState } from '#src-app/store/slices/ProcessInstance';

const JOB_STATUSES = [WsMessage.JOB_WAITING, WsMessage.JOB_ACTIVE, WsMessage.JOB_FAILED];

export const checkJobStatus = (processId: number, active: ProcessInstanceState['active']) =>
    processId &&
    active.jobsMap &&
    active.jobsMap[processId] &&
    'eventType' in active.jobsMap[processId] &&
    JOB_STATUSES.includes(active.jobsMap[processId]?.eventType);
