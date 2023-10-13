import { IProcess, IProcessInstance, ProcessInstanceStatus } from 'runbotics-common';

import { ProcessTab } from '#src-app/utils/process-tab';

export const buildProcessUrl = (process: IProcess, tabName = ProcessTab.RUN) => `/app/processes/${process.id}/${tabName}`;

export const checkActiveProcess = (processInstance: IProcessInstance) => {
    if (processInstance && (
        processInstance.status === ProcessInstanceStatus.INITIALIZING ||
        processInstance.status === ProcessInstanceStatus.IN_PROGRESS
    )) { return true; }

    return false;
};
