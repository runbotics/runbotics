import { NotificationProcessType } from "./notification-type.model";
import { User } from "./user.model";

export interface NotificationProcess {
    id: string;
    user: User;
    type: NotificationProcessType;
    createdAt: string;
}
