import { IProcess } from "./process.model";
import { IUser } from "./user.model";

export interface UserProcess {
    id: {
        userId: number;
        processId: number;
    };
    subscribedAt: string;
    user: IUser | number;
    process: IProcess | number;
}
