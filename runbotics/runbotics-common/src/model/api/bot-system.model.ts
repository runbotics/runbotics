export interface IBotSystem {
    name: BotSystemType;
}

export enum BotSystemType {
    WINDOWS = 'WINDOWS',
    LINUX = 'LINUX',
    MAC = 'MAC',
    ANY = 'ANY'
}
