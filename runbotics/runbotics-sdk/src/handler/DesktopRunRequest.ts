import { BpmnExecutionEventMessageApi } from "bpmn-engine";

interface CommonDesktopRunRequest {
    processInstanceId: string;
    rootProcessInstanceId: string;
    rootProcessSystem: string;
    userId: number;
    executionContext: BpmnExecutionEventMessageApi;
    trigger: { name: string };
    triggerData?: unknown;
}

export interface DesktopRunRequest<S extends string = string, I = any> extends CommonDesktopRunRequest {
    script: S;
    input: I;
}
