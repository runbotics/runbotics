import { BpmnExecutionEventMessageApi } from "bpmn-engine";

interface CommonDesktopRunRequest {
    processInstanceId: string;
    rootProcessInstanceId: string;
    userId: number;
    executionContext: BpmnExecutionEventMessageApi;
    trigger: string;
    triggeredBy?: string;
}

export interface DesktopRunRequest<S extends string = string, I = any> extends CommonDesktopRunRequest {
    script: S;
    input: I;
}
