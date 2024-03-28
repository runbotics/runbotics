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
    START_PROCESS = 'start-process',
    PROCESS_WAITING = 'process-waiting',
    PROCESS_PROCESSING = 'process-processing',
    PROCESS_REMOVED = 'process-removed',
    PROCESS_COMPLETED = 'process-completed',
    PROCESS_FAILED = 'process-failed',
    PROCESS_QUEUE_UPDATE = 'process-queue-update',
    TERMINATE_JOB = 'terminate-job'
}
