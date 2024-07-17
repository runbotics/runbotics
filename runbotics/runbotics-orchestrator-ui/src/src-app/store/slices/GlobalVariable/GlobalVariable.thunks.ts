import { IGlobalVariable } from '#src-app/types/model/global-variable.model';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

export const getGlobalVariables = ApiTenantResource
    .get<IGlobalVariable[]>('globalVariables/getGlobalVariables', 'global-variables');

export const createGlobalVariable = ApiTenantResource
    .post<IGlobalVariable, IGlobalVariable>('globalVariables/createGlobalVariable', 'global-variables');

export const updateGlobalVariable = ApiTenantResource
    .patch<IGlobalVariable, IGlobalVariable>('globalVariables/updateGlobalVariable', 'global-variables');

export const deleteGlobalVariable = ApiTenantResource
    .delete<void>('globalVariables/deleteGlobalVariable', 'global-variables');
