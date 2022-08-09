export enum FeatureKey {
    PROCESS_READ = 'PROCESS_READ', // lista procesow = /app/processes + konkretny proces
    PROCESS_ADD = 'PROCESS_ADD', // przycisk dodawania
    PROCESS_EDIT_INFO = 'PROCESS_EDIT_INFO', // akcja edit na kafelku
    PROCESS_DELETE = 'PROCESS_DELETE', // akcja delete na kafelku
    PROCESS_START = 'PROCESS_START', // ukryj przycisku RUN na procesie
    PROCESS_EDIT_STRUCTURE = 'PROCESS_EDIT_STRUCTURE', //  tylko read to wyswietl viewer zamiast modelera, nie mozna wyswieltac panulu info actions
    PROCESS_BOT_COLLECTION_EDIT = 'PROCESS_BOT_COLLECTION_EDIT', // Bot collection select disable
    PROCESS_BOT_COLLECTION_READ = 'PROCESS_BOT_COLLECTION_READ', // Bot collection select ukryj
    PROCESS_BOT_SYSTEM_EDIT = 'PROCESS_BOT_SYSTEM_EDIT', // Bot collection select  disable
    PROCESS_BOT_SYSTEM_READ = 'PROCESS_BOT_SYSTEM_READ', // Bot collection select  ukryj

    PROCESS_INSTANCE_READ = 'PROCESS_INSTANCE_READ', // panel z run info 
    PROCESS_INSTANCE_TERMINATE = 'PROCESS_INSTANCE_TERMINATE', // active processes guzik terminate
    PROCESS_INSTANCE_HISTORY_READ = 'PROCESS_INSTANCE_HISTORY_READ', // na run tez jest

    PROCESS_INSTANCE_EVENT_READ = 'PROCESS_INSTANCE_EVENT_READ', // brak eventow w procesie po uruchomieniu procesu

    SCHEDULE_READ = 'SCHEDULE_READ', // RUN process / wyswietlanie schedules
    SCHEDULE_ADD = 'SCHEDULE_ADD', // cron u gory
    SCHEDULE_DELETE = 'SCHEDULE_DELETE', // usuwanie dodanego cron'a na run process

    BOT_READ = 'BOT_READ', // widok bots
    BOT_HISTORY_READ = 'BOT_HISTORY_READ', // logi na bocie
    BOT_LOG_READ = 'BOT_LOG_READ', // console na bocie
    BOT_DELETE = 'BOT_DELETE', // usuwanie bota na liscie bots

    BOT_COLLECTION_READ = 'BOT_COLLECTION_READ', // zakladka collections na bots
    BOT_COLLECTION_EDIT = 'BOT_COLLECTION_EDIT', // akcja modify
    BOT_COLLECTION_ADD = 'BOT_COLLECTION_ADD', // przycisk add 
    BOT_COLLECTION_DELETE = 'BOT_COLLECTION_DELETE', // akcja delete

    EXTERNAL_ACTION_READ = 'EXTERNAL_ACTION_READ', // widok akcji
    EXTERNAL_ACTION_EDIT = 'EXTERNAL_ACTION_EDIT', // akcja
    EXTERNAL_ACTION_ADD = 'EXTERNAL_ACTION_ADD', // przycisk 
    EXTERNAL_ACTION_DELETE = 'EXTERNAL_ACTION_DELETE', // akcja

    GLOBAL_VARIABLE_READ = 'GLOBAL_VARIABLE_READ',
    GLOBAL_VARIABLE_EDIT = 'GLOBAL_VARIABLE_EDIT',
    GLOBAL_VARIABLE_ADD = 'GLOBAL_VARIABLE_ADD',
    GLOBAL_VARIABLE_DELETE = 'GLOBAL_VARIABLE_DELETE',

    SCHEDULER_PAGE_READ = 'SCHEDULER_PAGE_READ',
    SCHEDULER_JOBS_READ = 'SCHEDULER_JOBS_READ', // bez wplywu na FE
    SCHEDULER_JOBS_DELETE = 'SCHEDULER_JOBS_DELETE',

    HISTORY_READ = 'HISTORY_READ', // historia page

    BASIC_USER_READ = 'BASIC_USER_READ',
}

export interface IFeatureKey {
    name: FeatureKey;
}
