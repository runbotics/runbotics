export interface ActionVariableObject {
    name: string;
    value: string;
}

export interface ActionVariables {
    inputActionVariables: ActionVariableObject[];
    outputActionVariables: ActionVariableObject[];
}

export interface GlobalVariable {
    value: string;
    name: string;
}
