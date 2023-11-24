import { BpmnEngine, BpmnEngineExecutionEnvironment } from 'bpmn-engine';

export interface IBehaviour {
    $type: string;
    id: string;
    actionId: string;
    label: string;
}

export interface IActivityOwner extends BpmnEngine {
    behaviour?: IBehaviour;
}
export interface IEnvironment extends BpmnEngineExecutionEnvironment {
    runbotic: {
        disabled?: boolean;
    };
}
