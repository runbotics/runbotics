import { BotStatus } from './bot-status.model';
import { User } from './user.model';
import { IBotSystem } from './bot-system.model';
import { IBotCollection } from './bot-collection.model';
import { Tenant } from './tenant.model';

export interface IBot {
    id?: number;
    installationId?: string;
    created?: string | null;
    lastConnected?: string | null;
    user?: User | null;
    system?: IBotSystem;
    status?: BotStatus;
    collection?: IBotCollection;
    version?: string | null;
    tenantId?: Tenant['id'];
}
