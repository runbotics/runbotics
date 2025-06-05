import { IGlobalVariable } from '#src-app/types/model/global-variable.model';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import { Page } from '#src-app/utils/types/page';

const GLOBAL_VARIABLES_PATH = 'global-variables';


export const getGlobalVariables = ApiTenantResource
    .get<Page<IGlobalVariable>>('globalVariables/getGlobalVariables', GLOBAL_VARIABLES_PATH);

export const createGlobalVariable = ApiTenantResource
    .post<IGlobalVariable, IGlobalVariable>('globalVariables/createGlobalVariable', GLOBAL_VARIABLES_PATH);

export const updateGlobalVariable = ApiTenantResource
    .patch<IGlobalVariable, IGlobalVariable>('globalVariables/updateGlobalVariable', GLOBAL_VARIABLES_PATH);

export const deleteGlobalVariable = ApiTenantResource
    .delete<void>('globalVariables/deleteGlobalVariable', GLOBAL_VARIABLES_PATH);
