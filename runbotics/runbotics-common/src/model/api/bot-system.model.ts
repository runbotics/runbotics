export interface IBotSystem {
    name: BotSystem;
}

export enum BotSystem {
    WINDOWS = 'WINDOWS',
    LINUX = 'LINUX',
    MAC = 'MAC',
    ANY = 'ANY'
}
