import { IUser } from './user.model';

export interface Guest {
    ipHash: string;
    user: IUser;
    executionsCount: number;
}
