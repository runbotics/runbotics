import { Request } from 'express';
import { IUser } from 'runbotics-common';

export interface AuthRequest extends Request {
    user: IUser;
}