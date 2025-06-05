import { IGlobalVariable } from '#src-app/types/model/global-variable.model';
import { Page } from '#src-app/utils/types/page';

export interface GlobalVariableState {
    globalVariables: Page<IGlobalVariable>;
    loading: boolean;
}
