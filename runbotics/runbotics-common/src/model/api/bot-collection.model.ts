import { User } from './user.model';

export interface IBotCollection {
    tenantId?: string;
    id: string;
    name: string;
    publicBotsIncluded: boolean;
    description?: string;
    created?: string | null;
    updated?: string | null;
    createdBy?: User;
    users?: User[];
}
