import { IBot, IUser } from 'runbotics-common';
import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
    user: IUser;
}

export interface BotAuthSocket extends AuthSocket {
    bot: IBot;
}