import { BpmnEngine, BpmnEngineExecutionEnvironment } from 'bpmn-engine';

export interface IBehaviour {
    $type: string;
    id: string;
    actionId: string;
    label: string;
    conditionExpression?: IFormalExpression;
}

export interface IFormalExpression {
    $type: string;
    body?: string;
}

export interface IOutboundSequence {
    behaviour: IBehaviour;
    isDefault?: boolean;
}

export interface IActivityOwner extends BpmnEngine {
    behaviour?: IBehaviour;
    outbound: IOutboundSequence[];
}
export interface IEnvironment extends BpmnEngineExecutionEnvironment {
    runbotic: {
        disabled?: boolean;
    };
}
