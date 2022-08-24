import { IGlobalVariable } from 'src/types/model/global-variable.model';

export interface GlobalVariableState {
    globalVariables: IGlobalVariable[];
    loading: boolean;
}
