export enum BotWsMessage {
    TERMINATE = 'terminate',
    CONFIGURATION = 'configuration',
    START_PROCESS = 'start-process',
    PROCESS_INSTANCE_EVENT = 'process-instance-event',
    PROCESS_INSTANCE_LOOP_EVENT = "process-instance-loop-event",
    PROCESS_INSTANCE = 'process-instance',
    KEEP_ALIVE = 'keep-alive',
    LOG = "log",
}

export enum WsMessage {
    PROCESS_INSTANCE_EVENT = 'process-instance-event',
    PROCESS_INSTANCE_LOOP_EVENT = 'process-instance-loop-event',
    PROCESS = 'process',
    BOT_STATUS = 'bot-status',
    BOT_DELETE = 'bot-delete',
    ADD_SCHEDULE_PROCESS = 'add-schedule-process',
    REMOVE_SCHEDULE_PROCESS = 'remove-schedule-process',
    ADD_WAITING_SCHEDULE = 'add-waiting-schedule',
    REMOVE_WAITING_SCHEDULE = 'remove-waiting-schedule',
    PROCESS_STARTED = 'process-started',
    JOB_REMOVE = "job-remove",
    JOB_WAITING = 'job-waiting',
    JOB_ACTIVE = 'job-active',
    JOB_FAILED = 'job-failed',
}
