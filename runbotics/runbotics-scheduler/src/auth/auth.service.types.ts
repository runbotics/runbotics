import { IBotCollection, IBotSystem, IUser } from 'runbotics-common';

export interface MutableBotParams {
    collection: IBotCollection;
    system: IBotSystem;
    version: string;
}

export interface RegisterNewBotParams extends MutableBotParams {
    user: IUser;
    installationId: string;
}
