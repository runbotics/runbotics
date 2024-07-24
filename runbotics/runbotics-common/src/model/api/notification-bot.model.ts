import { IBot } from "./bot.model";
import { NotificationBotType } from "./notification-type.model";
import { IUser } from "./user.model";

export interface NotificationBot {
    id: number;
    user: IUser;
    bot: IBot;
    type: NotificationBotType;
    createdAt: string;
}
