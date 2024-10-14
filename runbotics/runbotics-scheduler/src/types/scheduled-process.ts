import { User } from '#/scheduler-database/user/user.entity';
import { IProcess } from 'runbotics-common';

export interface ValidateProcessAccessProps {
    process: IProcess,
    user?: User,
    triggered?: boolean
}