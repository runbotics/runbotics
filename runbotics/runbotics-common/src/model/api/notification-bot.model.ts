import { IBot } from "./bot.model";
import { IUser } from "./user.model";

export interface NotificationBot {
    id: number;
    userId: number;
    botId: number;
    user: IUser;
    bot: IBot;
    type: string;
    createdAt: string;
}
