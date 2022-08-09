import { BpmnExecutionEventMessageApi } from "bpmn-engine";

export interface DesktopRunRequest<I> {
    script: string;
    input: I;
    processInstanceId: string;
    rootProcessInstanceId: string;
    userId: number;
    scheduled?: boolean;
    executionContext: BpmnExecutionEventMessageApi;
}
