export interface IProcessTrigger {
    name: ProcessTrigger;
}

export enum ProcessTrigger {
    MANUAL = 'MANUAL',
    SCHEDULER = 'SCHEDULER',
    API = 'API',
    EMAIL = 'EMAIL',
}
