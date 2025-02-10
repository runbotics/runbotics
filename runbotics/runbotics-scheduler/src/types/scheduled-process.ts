import { User } from '#/scheduler-database/user/user.entity';
import { IProcess } from 'runbotics-common';

export interface ValidateProcessAccessProps {
    process: IProcess,
    user: Partial<User>,
    triggered?: boolean
}