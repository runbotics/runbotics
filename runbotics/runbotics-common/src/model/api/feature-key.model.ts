export enum FeatureKey {
     // Add switcher "display processes as a LIST or GRID" (by default it's grid) [ Processes page ]
     PROCESS_LIST_TABLE_VIEW = 'PROCESS_LIST_TABLE_VIEW',

    // CRUD access to every process for admins -> in the future can be extended for starting, stopping, etc.
    PROCESS_ALL_ACCESS = 'PROCESS_ALL_ACCESS',

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

    // Allow to display basic actions list at process build page [ Processes page -> process -> BUILD tab ]
    PROCESS_ACTIONS_LIST = 'PROCESS_ACTIONS_LIST',

    // Allow to display advanced actions list at the process build page [ Processes page -> process -> BUILD tab]
    PROCESS_ACTIONS_LIST_ADVANCED = 'PROCESS_ACTIONS_LIST_ADVANCED',

    // Allow to display templates list at the process build page [ Processes page -> process -> BUILD tab ]
    PROCESS_TEMPLATES_LIST = 'PROCESS_TEMPLATES_LIST',

    // Allow to switch state "attended" to "not attended" [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_ATTENDED_EDIT = 'PROCESS_IS_ATTENDED_EDIT',

    // Show "Is process attended" switcher [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_ATTENDED_READ = 'PROCESS_IS_ATTENDED_READ',

    // Allow to execute triggerable proces by url /scheduler/trigger/:processInfo [ ? Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_TRIGGERABLE_EXECUTE = 'PROCESS_IS_TRIGGERABLE_EXECUTE',

    // Show "Is process triggerable" switcher [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_TRIGGERABLE_READ = 'PROCESS_IS_TRIGGERABLE_READ',

    // Allow to switch state "triggerable" to "not triggerable" [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_IS_TRIGGERABLE_EDIT = 'PROCESS_IS_TRIGGERABLE_EDIT',

    // Allow to select particular bot collection [ Processes page -> process -> CONFIGURE tab ]
    PROCESS_BOT_COLLECTION_EDIT = 'PROCESS_BOT_COLLECTION_EDIT',

    // Bot collection select ukryj // ?
    PROCESS_BOT_COLLECTION_READ = 'PROCESS_BOT_COLLECTION_READ',

    // Bot collection select  disable // ?
    PROCESS_BOT_SYSTEM_EDIT = 'PROCESS_BOT_SYSTEM_EDIT',

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

    // Show tab "RUN" [ Processes page -> process]
    PROCESS_RUN_VIEW = 'PROCESS_RUN_VIEW',

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

    // Read/write access to every collection
    BOT_COLLECTION_ALL_ACCESS = 'BOT_COLLECTION_ALL_ACCESS',

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

    // used for api/admin/users/limited
    BASIC_USER_READ = 'BASIC_USER_READ',

    // Access to users page, manage users
    USERS_PAGE_READ = 'USERS_PAGE_READ',

    // Allow to read process output types
    PROCESS_OUTPUT_TYPE_READ = 'PROCESS_OUTPUT_TYPE_READ',

    // Allow to edit process output types
    PROCESS_OUTPUT_TYPE_EDIT = 'PROCESS_OUTPUT_TYPE_EDIT',

    PROCESS_COLLECTION_READ = 'PROCESS_READ',

    // Read/write access to every collection
    PROCESS_COLLECTION_ALL_ACCESS = 'PROCESS_COLLECTION_ALL_ACCESS',

    // Show "CREATE NEW COLLECTION" button on processes page in COLLECTIONS tab
    PROCESS_COLLECTION_ADD = 'PROCESS_COLLECTION_ADD',

    // Allow for editing properties of the existing collection (processes page -> COLLECTIONS tab -> 3 vertical dots -> "modify" option)
    PROCESS_COLLECTION_EDIT = 'PROCESS_COLLECTION_EDIT',

    // Allow to delete collection of processes (processes page -> COLLECTIONS tab -> 3 vertical dots -> "delete" option)
    PROCESS_COLLECTION_DELETE = 'PROCESS_COLLECTION_DELETE',

    // Read/write access to every tenant resource
    TENANT_ALL_ACCESS = 'TENANT_ALL_ACCESS',

    // Allows to read the resources assigned to the tenant
    TENANT_READ = 'TENANT_READ',

    // Allows to edit the resources assigned to the tenant
    TENANT_EDIT = 'TENANT_EDIT',

    // Allows to edit users assigned to the tenant
    TENANT_EDIT_USER = 'TENANT_EDIT_USER',

    // Allows to get invite code for admin of specific tenant
    TENANT_GET_INVITE_CODE = 'TENANT_GET_INVITE_CODE',

    // Allows to get invite code for every tenant
    TENANT_GET_ALL_INVITE_CODE = 'TENANT_GET_ALL_INVITE_CODE',

    // Allows to create invite code for admin of specific tenant
    TENANT_CREATE_INVITE_CODE = 'TENANT_CREATE_INVITE_CODE',

    // Allows to create invite code for all tenants
    TENANT_CREATE_ALL_INVITE_CODE = 'TENANT_CREATE_ALL_INVITE_CODE',

    // Allows to read credentials page
    CREDENTIALS_PAGE_READ = 'CREDENTIALS_PAGE_READ',
}

export interface IFeatureKey {
    name: FeatureKey;
}
