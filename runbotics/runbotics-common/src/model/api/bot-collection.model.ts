import { BasicUserDto, User } from "./user.model";

export interface IBotCollection {
    tenantId?: string;
    id: string;
    name: string;
    publicBotsIncluded: boolean;
    description?: string;
    created?: string | null;
    updated?: string | null;
    createdByUser?: User;
    users?: User[];
}

export type BotCollectionDto = Omit<IBotCollection, 'user' | 'createdByUser'> & {
    users?: BasicUserDto[];
    createdByUser?: BasicUserDto;
};
