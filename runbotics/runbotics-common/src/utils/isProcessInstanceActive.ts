import { ProcessInstanceStatus } from "../model";

export const isProcessInstanceActive = (processInstanceStatus: ProcessInstanceStatus) =>
    processInstanceStatus === ProcessInstanceStatus.INITIALIZING ||
    processInstanceStatus === ProcessInstanceStatus.IN_PROGRESS;