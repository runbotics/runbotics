import { IBotCollection, IUser } from 'runbotics-common';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';

export interface MutableBotParams {
    collection: IBotCollection;
    system: BotSystem;
    version: string;
    user: IUser;
}

export interface RegisterNewBotParams extends MutableBotParams {
    user: IUser;
    installationId: string;
}
