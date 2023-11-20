import { NotificationType } from "../../notifications";
import { IBot } from "./bot.model";
import { IUser } from "./user.model";

export interface NotificationBot {
    id: number;
    user: IUser;
    bot: IBot;
    type: NotificationType;
    createdAt: string;
}
