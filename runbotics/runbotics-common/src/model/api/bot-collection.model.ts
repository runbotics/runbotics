import { IUser } from './user.model';

export interface IBotCollection {
    id: string;
    name: string;
    publicBotsIncluded: boolean;
    description?: string;
    created?: string | null;
    updated?: string | null;
    createdBy?: IUser;
    users?: IUser[];
}
