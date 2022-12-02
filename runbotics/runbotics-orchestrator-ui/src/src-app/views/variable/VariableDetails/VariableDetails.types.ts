import { VariableDetailState, VariableType } from '../Variable.types';

export interface VariableDetailsProps {
    variableDetailState: VariableDetailState;
    onClose: () => void;
}

interface VariableBasis {
    name: string;
    description: string;
}

export interface VariableValue {
    id: string;
    value: string;
}

export interface ListVariableState {
    type: VariableType.LIST;
    value: VariableValue[];
}

export interface StringVariableState {
    type: VariableType.STRING;
    value: string;
}

export interface BooleanVariableState {
    type: VariableType.BOOLEAN;
    value: string;
}

export type VariableState = VariableBasis & (StringVariableState | ListVariableState | BooleanVariableState);

export interface VariableValidation {
    name?: boolean;
    value?: boolean;
    list?: boolean;
}

export interface Validator {
    error: boolean;
    helperText: string;
}
