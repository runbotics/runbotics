import { NotificationProcessType } from "./notification-type.model";
import { User } from "./user.model";

export interface NotificationProcess {
    id: string;
    user: User;
    email: string | '';
    type: NotificationProcessType;
    createdAt: string;
}
