export interface DecryptedProcessContextDto {
    id: number;
    
    processId: string;

    secrets: DecryptedProcessContextDtoSecret[];
}

export interface DecryptedProcessContextDtoSecret {
    id: number;

    name: string;
    
    processContextId: string;
    
    secret: SecretDto;

    secretId: string;
}

interface SecretDto {
    id: string;

    tenantId: number;

    data: string;
}
