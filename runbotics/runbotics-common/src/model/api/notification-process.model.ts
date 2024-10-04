import { NotificationProcessType } from "./notification-type.model";
import { IProcess } from "./process.model";
import { UserDto } from "./user.model";

export interface NotificationProcess {
    id: string;
    user: UserDto;
    type: NotificationProcessType;
    createdAt: string;
}
