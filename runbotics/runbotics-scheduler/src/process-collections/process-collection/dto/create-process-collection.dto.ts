export class CreateProcessCollectionDto {
    name: string;
    description: string;
    isPublic?: boolean;
    tenantId?: string;
    parentId?: string;
}
