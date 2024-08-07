import { BotStatus } from './bot-status.model';
import { IUser } from './user.model';
import { IBotSystem } from './bot-system.model';
import { IBotCollection } from './bot-collection.model';
import { NotificationBot } from './notification-bot.model';

export interface IBot {
    id?: number;
    installationId?: string;
    created?: string | null;
    lastConnected?: string | null;
    user?: IUser | null;
    system?: IBotSystem;
    status?: BotStatus;
    collection?: IBotCollection;
    version?: string | null;
    notifications?: NotificationBot[];
}
