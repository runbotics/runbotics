import { User } from '#/scheduler-database/user/user.entity';
import { Request } from 'express';

export interface AuthRequest extends Request {
    user: User;
}