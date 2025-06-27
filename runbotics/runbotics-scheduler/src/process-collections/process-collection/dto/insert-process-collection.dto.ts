export class InsertProcessCollectionDTO {
    name: string;
    description: string;
    createdBy?: string;
    isPublic?: boolean;
    tenantId?: string;
    parentId?: number;
}
