import { IBot } from "./bot.model";
import { IUser } from "./user.model";

export interface UserBot {
    userId: number;
    botId: number;
    user: IUser;
    bot: IBot;
    subscribedAt: string;
}
