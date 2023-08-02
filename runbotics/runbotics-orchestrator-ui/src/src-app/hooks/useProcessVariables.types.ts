import { ModdleElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';
export interface ActionVariableObject {
    name: string;
    value: string;
    scopeId?: string;
    actionId?: string;
}

export interface LoopVariableObject extends ActionVariableObject {}

export interface ActionVariables {
    inputActionVariables: ActionVariableObject[];
    outputActionVariables: ActionVariableObject[];
    loopVariables: LoopVariableObject[];
}

export interface GlobalVariable {
    value: string;
    name: string;
}
export interface Scope {
    id: string;
    children?: Scope[];
}

export interface ScopedModdleElement extends ModdleElement {
    scopeId: string;
}

export interface CategorizedElements { 
    localVarsAssigningActions: ModdleElement[];
    localLoops: ModdleElement[];
}

export interface ActionsAssignedVars {
    varsAssigningActions: ModdleElement[], 
    updatedScopeTree: Scope
}
