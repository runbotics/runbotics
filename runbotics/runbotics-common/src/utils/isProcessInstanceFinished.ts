import { ProcessInstanceStatus } from "../model";

export const isProcessInstanceFinished = (processInstanceStatus: ProcessInstanceStatus) => 
    processInstanceStatus === ProcessInstanceStatus.COMPLETED ||
    processInstanceStatus === ProcessInstanceStatus.ERRORED ||
    processInstanceStatus === ProcessInstanceStatus.TERMINATED;