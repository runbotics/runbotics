import { IBot } from "./bot.model";
import { NotificationBotType } from "./notification-type.model";
import { UserDto } from "./user.model";

export interface NotificationBot {
    id: string;
    user: UserDto;
    type: NotificationBotType;
    createdAt: string;
}
