export enum FeatureKey {
<<<<<<< Updated upstream
    // Add switcher "display processes as a LIST or GRID" (by default it's grid) [ Processes page ]
    PROCESS_LIST_TABLE_VIEW = 'PROCESS_LIST_TABLE_VIEW', 

    // Show details on process tile (like: date created, author, time updated, is scheduled, etc.) [ Processes page ]
    PROCESS_LIST_DETAIL_VIEW = 'PROCESS_LIST_DETAIL_VIEW', 

    // Allow to GET single process by id [ Processes page -> process ]
    PROCESS_READ = 'PROCESS_READ', 
    
    // Allow to GET list of all processes & GET single process by id [ Processes page ]
    PROCESS_LIST_READ = 'PROCESS_LIST_READ',

    // Show "ADD NEW PROCESS" button [ Processes page ]
    PROCESS_ADD = 'PROCESS_ADD', 

    // Action "Edit" on process tile -> 3 vertical dots (like: edit name, description, etc.) [ Processes page ]
    PROCESS_EDIT_INFO = 'PROCESS_EDIT_INFO', 

    // Action "Delete" on process tile -> 3 vertical dots [ Processes page ]
    PROCESS_DELETE = 'PROCESS_DELETE', 

    // Show "RUN" button & RUN tab [ Processes page -> process -> BUILD, RUN tabs ]
    PROCESS_START = 'PROCESS_START', 

    // Allow editing process structure in modeler (without it - only viewer mode & no access to panel info actions) [ Processes page -> process -> BUILD tab ]
    PROCESS_EDIT_STRUCTURE = 'PROCESS_EDIT_STRUCTURE', 
    
    // Allow to switch state "attended" to "not attended" [ Processes page -> process -> CONFIGURE tab ]
=======
    PROCESS_LIST_READ = 'PROCESS_LIST_READ', // display all processes
    PROCESS_LIST_TABLE_VIEW = 'PROCESS_LIST_TABLE_VIEW', // add option "display as a list" to view of all processes
    PROCESS_LIST_DETAIL_VIEW = 'PROCESS_LIST_DETAIL_VIEW', // show details of each process
    PROCESS_READ = 'PROCESS_READ', // lista procesow = /app/processes + konkretny proces
    PROCESS_ADD = 'PROCESS_ADD', // przycisk dodawania
    PROCESS_EDIT_INFO = 'PROCESS_EDIT_INFO', // akcja edit na kafelku
    PROCESS_DELETE = 'PROCESS_DELETE', // akcja delete na kafelku
    PROCESS_START = 'PROCESS_START', // ukryj przycisku RUN na procesie
    PROCESS_EDIT_STRUCTURE = 'PROCESS_EDIT_STRUCTURE', //  tylko read to wyswietl viewer zamiast modelera, nie mozna wyswieltac panulu info actions
>>>>>>> Stashed changes
    PROCESS_IS_ATTENDED_EDIT = 'PROCESS_IS_ATTENDED_EDIT',

    // Show "Is process attended" switcher [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_ATTENDED_READ = 'PROCESS_IS_ATTENDED_READ',
    
    // Allow to execute triggerable proces by url /scheduler/trigger/:processInfo [ ? Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_TRIGGERABLE_EXECUTE = 'PROCESS_IS_TRIGGERABLE_EXECUTE',
    
    // Show "Is process triggerable" switcher [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_TRIGGERABLE_READ = 'PROCESS_IS_TRIGGERABLE_READ',
    
    // Allow to switch state "triggerable" to "not triggerable" [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_TRIGGERABLE_EDIT = 'PROCESS_IS_TRIGGERABLE_EDIT',

<<<<<<< Updated upstream
    // Allow to select particular bot collection [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_BOT_COLLECTION_EDIT = 'PROCESS_BOT_COLLECTION_EDIT',
=======
    PROCESS_INSTANCE_READ = 'PROCESS_INSTANCE_READ', // panel z run info
    PROCESS_INSTANCE_TERMINATE = 'PROCESS_INSTANCE_TERMINATE', // active processes guzik terminate
    PROCESS_INSTANCE_HISTORY_READ = 'PROCESS_INSTANCE_HISTORY_READ', // na run tez jest
    PROCESS_INSTANCE_HISTORY_DETAIL_VIEW = 'PROCESS_INSTANCE_HISTORY_DETAIL_VIEW', // show additional columns in history table (in RUN tab)
>>>>>>> Stashed changes

    // Bot collection select ukryj // ?
    PROCESS_BOT_COLLECTION_READ = 'PROCESS_BOT_COLLECTION_READ',

<<<<<<< Updated upstream
    // Bot collection select  disable // ?
    PROCESS_BOT_SYSTEM_EDIT = 'PROCESS_BOT_SYSTEM_EDIT',
=======
    PROCESS_CONFIGURE_VIEW = 'PROCESS_CONFIGURE_VIEW', // add tab "configure" (next to RUN tab)

    SCHEDULE_READ = 'SCHEDULE_READ', // RUN process / wyswietlanie schedules
    SCHEDULE_ADD = 'SCHEDULE_ADD', // cron u gory
    SCHEDULE_DELETE = 'SCHEDULE_DELETE', // usuwanie dodanego cron'a na run process
>>>>>>> Stashed changes

    // Bot collection select ukryj // ?
    PROCESS_BOT_SYSTEM_READ = 'PROCESS_BOT_SYSTEM_READ',

    // Allow to GET all process instances & GET single process instance by id (displayed e.g. in: "History" table, "Run Info" sidebar) [ Processes page -> process -> RUN tab ]
    PROCESS_INSTANCE_READ = 'PROCESS_INSTANCE_READ',

    // Show "X" button to terminate active process instance [ Scheduler page -> Active processes ]
    PROCESS_INSTANCE_TERMINATE = 'PROCESS_INSTANCE_TERMINATE',

    // Show "History" table (of processes instances) [ Processes page -> process -> RUN tab ]
    PROCESS_INSTANCE_HISTORY_READ = 'PROCESS_INSTANCE_HISTORY_READ',

    // Show additional columns in "History" table (like: bot, etc.) [ Processes page -> process -> RUN tab ]
    PROCESS_INSTANCE_HISTORY_DETAIL_VIEW = 'PROCESS_INSTANCE_HISTORY_DETAIL_VIEW',

    // Show "Run Info" sidebar when e.g. RUN button is clicked [ Processes page -> process -> RUN tab ]
    PROCESS_INSTANCE_EVENT_READ = 'PROCESS_INSTANCE_EVENT_READ',

    // Show tab "CONFIGURE" [ Processes page -> process ]
    PROCESS_CONFIGURE_VIEW = 'PROCESS_CONFIGURE_VIEW',

    // Show tab "BUILD" [ Processes page -> process ]
    PROCESS_BUILD_VIEW = 'PROCESS_BUILD_VIEW',

    // Show "Schedules" section & GET all scheduled processes & GET single scheduled process by id & GET count all the bots & GET page [ e.g. Processes page -> process -> RUN tab ]
    SCHEDULE_READ = 'SCHEDULE_READ',

    // Show & allow to schedule process (show "SCHEDULE" button) [ Processes page -> process -> RUN tab ]
    SCHEDULE_ADD = 'SCHEDULE_ADD',

    // Show & allow to delete scheduled process (show "Trash icon" button) [ Processes page -> process -> RUN tab -> Schedules ]
    SCHEDULE_DELETE = 'SCHEDULE_DELETE',

    // Show "Bots" page & Allow to GET all bots & GET single bot by id [ Bots page ]
    BOT_READ = 'BOT_READ',

    // Show bot's "LOGS" tab [ Bots page -> table row -> "LOGS" tab ]
    BOT_HISTORY_READ = 'BOT_HISTORY_READ',

    // Show bot's "CONSOLE" tab [ Bots page -> table row -> "CONSOLE" tab ]
    BOT_LOG_READ = 'BOT_LOG_READ',

    // Allow to delete bot [ Bots page -> 3 vertical dots ]
    BOT_DELETE = 'BOT_DELETE',

    // Show "COLLECTIONS" tab [ Bots page ]
    BOT_COLLECTION_READ = 'BOT_COLLECTION_READ',

    //  Allow to modify collections of bots [ Bots page -> COLLECTIONS tab -> 3 vertical dots -> "Modify" option ]
    BOT_COLLECTION_EDIT = 'BOT_COLLECTION_EDIT',

    // Allow to add collection of bots [ Bots page -> COLLECTIONS tab -> "ADD NEW COLLECTION" button ]
    BOT_COLLECTION_ADD = 'BOT_COLLECTION_ADD',

    // Allow to delete collections of bots [ Bots page -> COLLECTIONS tab -> 3 vertical dots -> "Delete" option ]
    BOT_COLLECTION_DELETE = 'BOT_COLLECTION_DELETE',

    // Show "Actions" page & Allow to GET all external actions & GET single action by id [ Actions page ]
    EXTERNAL_ACTION_READ = 'EXTERNAL_ACTION_READ',

    // Allow to edit external action & show button (pen icon) [ Actions page -> pen icon ]
    EXTERNAL_ACTION_EDIT = 'EXTERNAL_ACTION_EDIT',

    // Allow to create new action & show button "ADD ACTION" [ Actions page -> "ADD ACTION" button ]
    EXTERNAL_ACTION_ADD = 'EXTERNAL_ACTION_ADD',

    // Allow to delete external action [ Actions page -> trash icon ]
    EXTERNAL_ACTION_DELETE = 'EXTERNAL_ACTION_DELETE',

    // Show "Global variables" page & allow to GET all global variables & GET single global variable by id [ Global variables page]
    GLOBAL_VARIABLE_READ = 'GLOBAL_VARIABLE_READ',
   
    // Allow to edit global variable [ Global variables page -> 3 vertical dots ]
    GLOBAL_VARIABLE_EDIT = 'GLOBAL_VARIABLE_EDIT',
    
    // Allow to add global variable [ Global variables page -> "ADD GLOBAL VARIABLE" button ]
    GLOBAL_VARIABLE_ADD = 'GLOBAL_VARIABLE_ADD',
        
    // Allow to delete global variable [ Global variables page -> 3 vertical dots ]
    GLOBAL_VARIABLE_DELETE = 'GLOBAL_VARIABLE_DELETE', 

    // Show "Scheduler" page & allow to GET scheduler/scheduled-jobs, scheduler/jobs/waiting, scheduler/scheduled-jobs/count [ Scheduler page]
    SCHEDULER_PAGE_READ = 'SCHEDULER_PAGE_READ',
        
    // Allow to GET scheduler/jobs (bez wplywu na FE)
    SCHEDULER_JOBS_READ = 'SCHEDULER_JOBS_READ',
        
    // Delete job from scheduler queue
    SCHEDULER_JOBS_DELETE = 'SCHEDULER_JOBS_DELETE',

    // Show "History" page [ History page ]
    HISTORY_READ = 'HISTORY_READ', 

    // ???
    BASIC_USER_READ = 'BASIC_USER_READ',
}

export interface IFeatureKey {
    name: FeatureKey;
}
