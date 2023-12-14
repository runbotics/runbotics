import { BpmnEngine, BpmnEngineExecutionEnvironment } from 'bpmn-engine';

export interface Behaviour {
    $type: string;
    id: string;
    actionId: string;
    label: string;
    conditionExpression?: FormalExpression;
}

export interface FormalExpression {
    $type: string;
    body?: string;
}

export interface OutboundSequence {
    behaviour: Behaviour;
    isDefault?: boolean;
}

export interface ActivityOwner extends BpmnEngine {
    behaviour?: Behaviour;
    outbound: OutboundSequence[];
}
export interface Environment extends BpmnEngineExecutionEnvironment {
    runbotic: {
        disabled?: boolean;
    };
}
