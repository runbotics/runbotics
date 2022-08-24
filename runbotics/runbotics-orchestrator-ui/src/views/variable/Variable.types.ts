import { IGlobalVariable } from '../../types/model/global-variable.model';

export interface VariableDetailState {
    show: boolean;
    variable?: IGlobalVariable;
    readOnly?: boolean;
}

export enum VariableType {
    STRING = 'STRING',
    LIST = 'LIST',
    BOOLEAN = 'BOOLEAN',
}
