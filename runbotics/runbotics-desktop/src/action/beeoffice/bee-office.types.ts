import { DesktopRunRequest } from '@runbotics/runbotics-sdk';

export type BeeOfficeActionRequest =
| DesktopRunRequest<'beeOffice.createNewTimetableActivity', BeeOfficeCreateNewTimetableActivityActionInput>
| DesktopRunRequest<'beeOffice.getEmployee', BeeOfficeGetEmployeeActionInput>
| DesktopRunRequest<'beeOffice.getEmployeeById', BeeOfficeGetEmployeeByIdActionInput>
| DesktopRunRequest<'beeOffice.getActivity', BeeOfficeGetActivityActionInput>
| DesktopRunRequest<'beeOffice.getSchedule', BeeOfficeGetScheduleActionInput>
| DesktopRunRequest<'beeOffice.deleteTimeTableActivity', BeeOfficeDeleteTimeTableActionInput>
| DesktopRunRequest<'beeOffice.getActivityGroups', BeeOfficeGetActivityGroupsActionInput>
| DesktopRunRequest<'beeOffice.getActivitiesByURLParameters', BeeOfficeGetActivitiesByURLParametersActionInput>
| DesktopRunRequest<'beeOffice.createHolidayLeave', BeeOfficeCreateHolidayLeaveActionInput>;

// ----
export type BeeOfficeGetActivityGroupsActionInput = {
    group: string;
};
export type BeeOfficeGetActivityGroupsActionOutput = any;

// ----
export type BeeOfficeGetActivitiesByURLParametersActionInput = {
    query: string;
};
export type BeeOfficeGetActivitiesByURLParametersActionOutput = any;

// ----
export type BeeOfficeDeleteTimeTableActionInput = {
    timeTableActivity: IBeeOfficeActivity;
};
export type BeeOfficeDeleteTimeTableActionOutput = any;

// ----
export type BeeOfficeGetScheduleActionInput = {
    employee: IBeeOfficeEmployee;
    date: string;
    limit?: string;
};
export type BeeOfficeGetScheduleActionOutput = any;

// ----
export type BeeOfficeGetEmployeeActionInput = {
    email: string;
};
export type BeeOfficeGetEmployeeActionOutput = any;

// ----
export type BeeOfficeGetEmployeeByIdActionInput = {
    id: string;
};
export type BeeOfficeGetEmployeeByIdActionOutput = any;

// ----
export type BeeOfficeGetActivityActionInput = {
    method: string;
    query: string;
};
export type BeeOfficeGetActivityActionOutput = IBeeOfficeActivity;

// ----
export type BeeOfficeCreateNewTimetableActivityActionInput = {
    employee: IBeeOfficeEmployee;
    activity: IBeeOfficeActivity;
    category: string;
    specialization: string;
    localization: string;
    date: string;
    duration: string;
    description: string;
};
export type BeeOfficeCreateNewTimetableActivityActionOutput = any;

// ----
export type BeeOfficeCreateHolidayLeaveActionInput = {
    employeeId: string;
    leaveConfigName: string;
    dateFrom: string;
    dateTo: string;
    isAdditional: string;
    description?: string;
    additionalProperties?: string;
};
export type BeeOfficeCreateHolidayLeaveActionOutput = unknown;

// ----

export type IBeeOfficeSuperior = {
    ID: string;
    forenameSurname: string;
    login: string;
};

export type IBeeOfficeEmployee = {
    structure_id_mainvalue: string;
    thumbnail: string;
    thumbnailPath: string;
    superiors: IBeeOfficeSuperior[];
    company: string;
    team: string;
    ID: string;
    HasEditRight: boolean;
    forenamesurname: string;
    structure_id: string;
    forename: string;
    surname: string;
    login: string;
    email: string;
    mpk: string;
    location_dic: number;
    location_dic_name: string;
    phonenr1: string;
    phonenr2: string;
    calendar_lang_dict: string;
    calendar_lang_dict_name: string;
    inactive: false;
    comunication_lang_dic: any;
    comunication_lang_dic_name: any;
    personal_number: string;
    log_type_dic: number;
    log_type_dic_name: string;
    log_info: string;
    alternativeActiveDirectoryLogin: any;
    loginLastSuccessful: string;
    friendlyName: string;
    local_bus_trip_country_id: any;
    local_bus_trip_currency_id: any;
    local_purch_currency_id: any;
    createdon: any;
    msaccount: string;
    mslogonparams: string;
    TZoneDef_id: any;
    room_id: string;
    htmleditor: boolean;
    company_dic: any;
    company_dic_name: any;
    contractor_id: any;
    tax_number: any;
};

export type IBeeOfficeActivity = {
    ID: string;
    HasEditRight: boolean;
    activitygroup_id: string;
    costobjectassignment: any;
    deputy_id: any;
    enddate: string;
    name: string;
    projectcode: string;
    notes: any;
    progress: any;
    responsibleperson_id: string;
    responsibleperson_id_mainvalue: string;
    startupdate: string;
    textnr: string;
    currency_id: any;
    description1: string;
    description2: any;
    description3: any;
    status_dic: 3;
    status_dic_name: string;
    status_dic_foreground: any;
    status_dic_background: any;
    proxy_id: any;
    documentationnotes: any;
    documentationnotes2: any;
    documentationnotes3: any;
    documentationnotes4: any;
    invcompany_id: string;
    invoicerecipient_id: string;
    invitemtype: number;
    invitemtype_name: string;
    invitemtax_id: any;
    invoicematuritydays: number;
    servicetask: boolean;
    warranty_type_dic: any;
    warranty_type_dic_name: any;
    warranty_status_dic: any;
    warranty_status_dic_name: any;
    warranty_coordinator_id: any;
    transfer_to_warranty: any;
    warranty_from: any;
    warranty_to: any;
    warranty_description: any;
    blockNewServiceRequestsCreation: boolean;
    blockNewServiceRequestsProcessing: boolean;
    invplan_split1: any;
    invplan_split2: any;
    invplan_split3: any;
    invplan_split4: any;
    serviceslacontract_id: any;
    projectRole1_id: any;
    projectRole1_id_mainvalue: any;
    projectRole2_id: any;
    projectRole2_id_mainvalue: any;
    projectRole3_id: any;
    projectRole3_id_mainvalue: any;
    projectRole4_id: any;
    projectRole4_id_mainvalue: any;
    bonusLockPersonList: boolean;
    daystoclose: any;
    daystonotify: any;
    budget1: any;
    budget2: any;
    budget3: any;
    orderstatus_dic: any;
    orderstatus_dic_name: any;
    allowserviceequipment: boolean;
    dataprocessing_category: any;
    dataprocessing_countries: any;
    dataprocessing_measures: any;
    dataprocessing_contractstatus_dic: any;
    dataprocessing_contractstatus_dic_name: any;
    svcassigngrouppattern: any;
    subtaskactivity_id: any;
    subtaskcategory_dic: any;
    subtaskcategory_dic_name: any;
};

export interface BeeOfficeCredential {
    username: string;
    password: string;
    logsys: string;
    url: string;
}

export type BeeOfficeAuth = Omit<BeeOfficeCredential, 'url'> & { grant_type: string }