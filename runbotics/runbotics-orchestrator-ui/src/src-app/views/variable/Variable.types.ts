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

export interface DeleteRejectResponseType {
    status: number;
    statusText: string;
    data: string[];
}

export interface DeleteRejectPayloadType {
    response: DeleteRejectResponseType;
}

export interface DeleteRejectType {
    type: string;
    payload: DeleteRejectPayloadType;
} 
