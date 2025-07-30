export enum SwaggerTags {
    PROCESS_COLLECTION = 'process collection',
    TENANT_USERS = 'tenants - users',
    TENANT_ROLE_ADMIN = 'tenants - admin only',
    TENANT_PUBLIC = 'tenants - public',
    PROCESS = 'process'
}

export const tenantIdSwaggerObjectDescription = {
    name: 'id',
    description: 'UUID of the tenant',
    type: 'string',
    format: 'uuid',
    example: '8a45c2b7-e25b-4b2e-9e3a-b6b2892e741f',
};


export const processIdSwaggerObjectDescription = {
    name: 'id',
    description: 'Numeric ID of the process to do operations on',
    type: 'integer',
    example: 44,
};