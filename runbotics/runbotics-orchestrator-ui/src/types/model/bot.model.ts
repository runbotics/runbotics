import { IUser } from './user.model';

export interface IBot {
    id?: number;
    installationId?: string;
    created?: string | null;
    lastConnected?: string | null;
    user?: IUser | null;
}

export const defaultValue: Readonly<IBot> = {};
