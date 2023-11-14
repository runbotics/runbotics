import { IBot, NotificationBot } from 'runbotics-common';

import { Page } from '../../../utils/types/page';

export interface BotState {
    bots: {
        loading: boolean;
        byId: Record<string, IBot>;
        allIds: string[];
        page: Page<IBot> | null;
        botSubscriptions: NotificationBot[];
    };
}
