export interface CreateCredentialDto {
    name: string;
    templateId: string;
    collectionId?: string;
    description?: string;
}

export interface EditCredentialDto {
    name: string;
    description?: string;
}
