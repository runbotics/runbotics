import { IGlobalVariable } from '#src-app/types/model/global-variable.model';

export interface GlobalVariableState {
    globalVariables: IGlobalVariable[];
    loading: boolean;
}
