import { ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';

export const getProcessInstanceStatusColor = (status: ProcessInstanceStatus | ProcessInstanceEventStatus) => {
    if (status === ProcessInstanceStatus.INITIALIZING) return 'primary';
    if (status === ProcessInstanceStatus.IN_PROGRESS) return 'secondary';
    if (status === ProcessInstanceStatus.COMPLETED) return 'success';
    if (status === ProcessInstanceStatus.ERRORED) return 'error';
    return 'warning';
};
