import { User } from '#/scheduler-database/user/user.entity';
import { IBot } from 'runbotics-common';
import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
    user: User;
}

export interface BotAuthSocket extends AuthSocket {
    bot: IBot;
}