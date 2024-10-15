import { IUser } from 'runbotics-common';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';

export interface MutableBotParams {
    collection: BotCollection;
    system: BotSystem;
    version: string;
    user: IUser;
}

export interface RegisterNewBotParams extends MutableBotParams {
    user: IUser;
    installationId: string;
}
