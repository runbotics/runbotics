import { DesktopRunRequest } from 'runbotics-sdk';

export type SAPActionRequest<I> = DesktopRunRequest<any> & {
    script:
        | 'sap.connect'
        | 'sap.startTransaction'
        | 'sap.endTransaction'
        | 'sap.type'
        | 'sap.disconnect'
        | 'sap.sendVKey'
        | 'sap.readText'
        | 'sap.click'
        | 'sap.doubleClick'
        | 'sap.index'
        | 'sap.focus'
        | 'sap.select';
};

// --- action
export type SAPClickActionInput = {
    target: string;
};
export type SAPClickActionOutput = any;

// --- action
export type SAPIndexActionInput = {
    target: string;
};
export type SAPIndexActionOutput = any;

// --- action
export type SAPFocusActionInput = {
    target: string;
};
export type SAPFocusActionOutput = any;

// --- action
export type SAPReadTextActionInput = {
    target: string;
};
export type SAPReadTextActionOutput = any;

// --- action
export type SAPSendVKeyActionInput = {
    virtualKey: string;
};
export type SAPSendVKeyActionOutput = {};

// --- action
export type SAPConnectActionInput = {
    connectionName: string;
    user: string;
    password: string;
};
export type SAPConnectActionOutput = {};

// --- action
export type SAPStartTransactionActionInput = {
    transaction: string;
};
export type SAPStartTransactionActionOutput = {};

// --- action
export type SAPTypeActionInput = {
    target: string;
    value: string;
};
export type SAPTypeActionOutput = {};

// --- action
export type SAPSelectActionInput = {
    target: string;
};
export type SAPSelectActionOutput = any;
