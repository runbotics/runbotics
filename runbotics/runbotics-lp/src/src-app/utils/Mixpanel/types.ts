export interface RecordFailedLogin extends Omit<AuthenticationBase, 'userType' | 'identifyBy'> {
    reason: string;
    userType?: USER_TYPE;
    identifyBy?: string;
}

export interface RecordSuccessfulAuthentication extends AuthenticationBase {
    email: string;
}

export interface RecordFailedRegistration extends AuthenticationBase {
    reason: string;
}

export interface RecordClick {
    itemName: CLICKABLE_ITEM;
    sourcePage: ENTERED_PAGE;
    extraProperties?: Record<string, Primitives>;
}

export interface RecordPageEntrance {
    enteredPage: ENTERED_PAGE;
}

export interface RecordProcessRunSuccess extends ProcessRunBase {
    processInstanceId: string;
}

export interface RecordProcessRunFail extends ProcessRunBase {
    reason: string;
}

export interface RecordProcessSaveSuccess extends ProcessRunBase {}

export interface RecordProcessSaveFail extends ProcessRunBase {
    reason: string;
}

interface ProcessRunBase {
    processName: string;
    processId: string;
}

interface TrackLabel {
    trackLabel: TRACK_LABEL;
}

interface AuthenticationBase extends TrackLabel {
    sourcePage: SOURCE_PAGE;
    userType: USER_TYPE;
    identifyBy: string;
}

type Primitives = string | number | boolean;

export enum USER_TYPE {
    TENANT_ADMIN = 'tenant_admin',
    ADMIN = 'admin',
    RPA_USER = 'rpa_user',
    GUEST = 'guest',
    USER = 'user',
    EXTERNAL_USER = 'external_user',
    UNKNOWN = 'unknown',
}

export enum SOURCE_PAGE {
    LOGIN = 'login',
    REGISTER = 'register',
    REFERRAL = 'referral',
}

export enum ENTERED_PAGE {
    BLOG = 'blog',
    LANDING = 'landing',
    LOGIN = 'login',
    REGISTER = 'register',
    MARKETPLACE = 'marketplace',
    NOT_SPECIFIED = 'not specified',
}

export enum TRACK_LABEL {
    SUCCESSFUL_LOGIN = 'Successful login',
    SUCCESSFUL_REGISTRATION = 'Successful registration',
    UNSUCCESSFUL_LOGIN = 'Unsuccessful login',
    UNSUCCESSFUL_REGISTRATION = 'Unsuccessful registration',
    PAGE_ENTER = 'Page enter',
    ITEM_CLICK = 'Item click',
    PROCESS_RUN_FAIL = 'Process run fail',
    PROCESS_RUN_SUCCESS = 'Process run success',
    PROCESS_SAVE_SUCCESS = 'Process save success',
    PROCESS_SAVE_FAIL = 'Process save fail',
}

export enum CLICKABLE_ITEM {
    BLOG_POST = 'blog post',
    RUN_BUTTON = 'run button',
    SAVE_BUTTON = 'save button',
    LOGOUT_BUTTON = 'logout button',
    MARKETPLACE_OFFER = 'marketplace offer',
}

export enum ERROR_REASON {
    UNEXPECTED_ERROR = 'unexpected error',
    UNKNOWN = 'unknown',
    LIMIT_EXCEEDED = 'limit exceeded',
}
