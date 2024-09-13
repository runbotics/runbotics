import { BpmnExecutionEventMessageApi } from "bpmn-engine";

interface CommonDesktopRunRequest {
    processInstanceId: string;
    rootProcessInstanceId: string;
    userId: number;
    executionContext: BpmnExecutionEventMessageApi;
    trigger: { name: string };
    parentProcessInstanceId?: string;
    triggerData?: unknown;
    credentials?: {
        name: string;
        template: string;
        attributes: {
            id: string;
            name: string;
            value: string;
        }[];
    }[];
}

export interface DesktopRunRequest<S extends string = string, I = any> extends CommonDesktopRunRequest {
    script: S;
    input: I;
}
