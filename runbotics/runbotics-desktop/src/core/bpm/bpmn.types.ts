import { BpmnEngine } from 'bpmn-engine';
import { RunBoticsExecutionEnvironment } from './runtime';

export interface CamundaParameter {
    $type: string;
    name: string;
    value: string;
}

export interface CamundaInputOutputElement {
    $type: string;
    inputParameters: CamundaParameter[];
    outputParameters: CamundaParameter[];
}

export interface ExtensionElements {
    $type: string;
    values: CamundaInputOutputElement[];
}

export interface Behaviour {
    $type: string;
    id: string;
    name: string;
    actionId: string;
    label: string;
    conditionExpression?: FormalExpression;
    extensionElements?: ExtensionElements;
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
export interface Environment extends RunBoticsExecutionEnvironment {}

export interface BpmnElement {
    behaviour: Behaviour;
}
