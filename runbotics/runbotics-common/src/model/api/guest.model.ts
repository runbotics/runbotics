import { UserDto } from './user.model';

export interface Guest {
    ipHash: string;
    user: UserDto;
    executionsCount: number;
}
