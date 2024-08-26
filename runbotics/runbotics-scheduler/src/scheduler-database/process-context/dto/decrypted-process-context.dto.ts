export interface DecryptedProcessContextDto {
    id: string;
    
    processId: number;

    secrets: DecryptedProcessContextDtoSecret[];
}

export interface DecryptedProcessContextDtoSecret {
    id: string;

    name: string;
    
    processContextId: string;
    
    secret: SecretDto;

    secretId: string;
}

interface SecretDto {
    id: string;

    tenantId: string;

    data: string;
}
