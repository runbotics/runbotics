import { IBot } from "./bot.model";
import { NotificationBotType } from "./notification-type.model";
import { IUser } from "./user.model";

export interface NotificationBot {
    id: string;
    user: IUser;
    type: NotificationBotType;
    createdAt: string;
}
