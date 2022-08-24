export enum BotWsMessage {
    TERMINATE = 'terminate',
    CONFIGURATION = 'configuration',
    START_PROCESS = 'start-process',
    PROCESS_INSTANCE_EVENT = 'process-instance-event',
    PROCESS_INSTANCE = 'process-instance',
    LOG = "log",
}

export enum WsMessage {
    PROCESS_INSTANCE_EVENT = 'process-instance-event',
    PROCESS = 'process',
    BOT_STATUS = 'bot-status',
    BOT_DELETE = 'bot-delete',
    ADD_SCHEDULE_PROCESS = 'add-schedule-process',
    REMOVE_SCHEDULE_PROCESS = 'remove-schedule-process',
    ADD_WAITING_SCHEDULE = 'add-waiting-schedule',
    REMOVE_WAITING_SCHEDULE = 'remove-waiting-schedule'
}
