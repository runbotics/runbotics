import { NotificationProcessType } from "./notification-type.model";
import { User } from "./user.model";

export interface NotificationProcess {
    id: string;
    user: User;
    customEmail: string;
    type: NotificationProcessType;
    createdAt: string;
}

export type CreateNotificationProcessDto = { 
    processId: number, 
    type: NotificationProcessType, 
    customEmail?: string 
}