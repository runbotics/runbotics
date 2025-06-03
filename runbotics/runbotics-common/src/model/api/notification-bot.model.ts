import { NotificationBotType } from "./notification-type.model";
import { User } from "./user.model";

export interface NotificationBot {
    id: string;
    user: User;
    customEmail: string;
    type: NotificationBotType;
    createdAt: string;
}

export type CreateNotificationBotDto = { 
    botId: number, 
    type: NotificationBotType, 
    customEmail?: string 
}