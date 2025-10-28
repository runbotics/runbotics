import { Role } from "../model";

export const getRolesAllowedInTenant = () => [Role.ROLE_RPA_USER, Role.ROLE_EXTERNAL_USER, Role.ROLE_TENANT_ADMIN];
export const getRolesAllowedInDefaultTenant = () => [Role.ROLE_RPA_USER, Role.ROLE_USER, Role.ROLE_EXTERNAL_USER, Role.ROLE_TENANT_ADMIN];
