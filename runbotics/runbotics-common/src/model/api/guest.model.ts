import { User } from './user.model';

export interface Guest {
    ipHash: string;
    user: User;
    executionsCount: number;
}
