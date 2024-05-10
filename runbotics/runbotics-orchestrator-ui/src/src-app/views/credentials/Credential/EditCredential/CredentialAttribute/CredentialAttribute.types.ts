export interface Attribute {
    id: string,
    name: string;
    value: string;
    masked: boolean;
    credentialId: string,
    collectionId: string
    description?: string;
}
