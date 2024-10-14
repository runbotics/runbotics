import { NotificationBotType } from "./notification-type.model";
import { User } from "./user.model";

export interface NotificationBot {
    id: string;
    user: User;
    type: NotificationBotType;
    createdAt: string;
}
