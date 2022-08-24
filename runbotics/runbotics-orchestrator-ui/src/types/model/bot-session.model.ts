import { IBot } from './bot.model';

export interface IBotSession {
    sessionId: string;
    connected: boolean;
    bot: IBot;
}
