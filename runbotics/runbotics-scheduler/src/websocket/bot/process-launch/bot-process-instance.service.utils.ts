import { ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';

const COMMON_PROCESS_INSTANCE_FIELDS = [
    'error', 'root_process_instance_id', 'orchestrator_process_instance_id',
    'trigger', 'trigger_data', 'step','user_id', 'process_id', 'bot_id',
];

const COMPLETED_PROCESS_INSTANCE_FIELDS = ['status', 'updated', 'output', ...COMMON_PROCESS_INSTANCE_FIELDS];
const STARTING_PROCESS_INSTANCE_FIELDS = ['input', 'created', ...COMMON_PROCESS_INSTANCE_FIELDS];

export const isProcessInstanceFinished = (
    status: ProcessInstanceStatus
) => ProcessInstanceStatus.COMPLETED === status
    || ProcessInstanceStatus.ERRORED === status
    || ProcessInstanceStatus.TERMINATED === status;

export const getProcessInstanceUpdateFieldsByStatus = (
    newStatus: ProcessInstanceStatus, dbStatus: ProcessInstanceStatus | undefined,
) => {
    switch(newStatus) {
        case ProcessInstanceStatus.INITIALIZING: {
            if (dbStatus) return STARTING_PROCESS_INSTANCE_FIELDS;
            return ['status', ...STARTING_PROCESS_INSTANCE_FIELDS];
        }
        case ProcessInstanceStatus.COMPLETED:
        case ProcessInstanceStatus.ERRORED:
        case ProcessInstanceStatus.STOPPED:
        case ProcessInstanceStatus.TERMINATED:
            return COMPLETED_PROCESS_INSTANCE_FIELDS;

        default: {
            if (isProcessInstanceFinished(dbStatus)) return COMMON_PROCESS_INSTANCE_FIELDS;
            return ['input', 'status', ...COMMON_PROCESS_INSTANCE_FIELDS];
        }
    }
};

export const getIsEventTerminated = (eventStatus: ProcessInstanceEventStatus, instanceStatus: ProcessInstanceStatus) => 
    instanceStatus === ProcessInstanceStatus.TERMINATED && 
    eventStatus === ProcessInstanceEventStatus.IN_PROGRESS;