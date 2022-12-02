export interface IBotType {
    type: BotType;
}

export enum BotType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    WINDOWS = 'WINDOWS',
    LINUX = 'LINUX',
}
