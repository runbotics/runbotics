export interface ITriggerEvent {
    name: TriggerEvent;
}

export enum TriggerEvent {
    MANUAL = 'MANUAL',
    SCHEDULER = 'SCHEDULER',
    API = 'API',
    EMAIL = 'EMAIL',
}
