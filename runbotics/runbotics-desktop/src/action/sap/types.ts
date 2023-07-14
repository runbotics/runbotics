import { DesktopRunRequest } from 'runbotics-sdk';

export type SAPActionRequest =
| DesktopRunRequest<'sap.connect', SAPConnectActionInput>
| DesktopRunRequest<'sap.startTransaction', SAPStartTransactionActionInput>
| DesktopRunRequest<'sap.endTransaction', never>
| DesktopRunRequest<'sap.type', SAPTypeActionInput>
| DesktopRunRequest<'sap.disconnect', never>
| DesktopRunRequest<'sap.sendVKey', SAPSendVKeyActionInput>
| DesktopRunRequest<'sap.readText', SAPReadTextActionInput>
| DesktopRunRequest<'sap.click', SAPClickActionInput>
| DesktopRunRequest<'sap.doubleClick', SAPClickActionInput>
| DesktopRunRequest<'sap.index', SAPIndexActionInput>
| DesktopRunRequest<'sap.focus', SAPFocusActionInput>
| DesktopRunRequest<'sap.select', SAPSelectActionInput>
| DesktopRunRequest<'sap.openContextMenu', SAPOpenContextMenuActionInput>
| DesktopRunRequest<'sap.selectFromContextMenu', SAPSelectFromContextMenuActionInput>
| DesktopRunRequest<'sap.clickToolbarButton', SAPClickToolbarButtonActionInput>
| DesktopRunRequest<'sap.selectTableRow', SAPSelectTableRowActionInput>;

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
    client: string;
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

// --- action
export type SAPOpenContextMenuActionInput = {
    target: string;
    menuId: string;
};
export type SAPOpenContextMenuActionOutput = any;

// --- action
export type SAPSelectFromContextMenuActionInput = {
    target: string;
    optionId: string;
};
export type SAPSelectFromContextMenuActionOutput = any;

// --- action
export type SAPClickToolbarButtonActionInput = {
    target: string;
    toolId: string;
};
export type SAPClickToolbarButtonActionOutput = any;

export interface SAPSelectTableRowActionInput {
    target: string;
    rowIndex: string;
}
