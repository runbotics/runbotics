import { BpmnEngine, BpmnEngineExecutionEnvironment } from 'bpmn-engine';

interface IBehaviour {
    $type: string;
    id: string;
    actionId: string;
    label: string;
}

export interface IActivityOwner extends BpmnEngine {
    behaviour?: IBehaviour;
}
export interface IEnviroment extends BpmnEngineExecutionEnvironment {
    runbotic: {
        disabled?: boolean;
    };
}
