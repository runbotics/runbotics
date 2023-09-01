import { MicrosoftCloudPlatform } from 'runbotics-common';

export type SessionIdentifier = string;
export type WorksheetIdentifier = number | string;

export interface OneDriveSession {
    platform: MicrosoftCloudPlatform;
    sessionIdentifier: SessionIdentifier;
    worksheetIdentifier: WorksheetIdentifier;
}

export interface SharePointSession extends OneDriveSession {
    siteName?: string,
    listName?: string
}

export interface OpenFileInput extends SharePointSession {
    persistChanges: boolean,
}

export interface Session extends OneDriveSession {
    workbookSessionInfo: WorkbookSessionInfo;
    siteId?: string;
    driveId?: string;
    fileId?: string;
}

export interface WorkbookSessionInfo {
    id: string;
    persistChanges: boolean;
}

export interface WorkbookCellCoordinates {
    row: string;
    column: string;
}

export interface WorkbookRange {
    address?: string;
    addressLocal?: string;
    cellCount?: number;
    columnCount?: number;
    columnHidden?: boolean;
    columnIndex?: number;
    formulas?: string;
    formulasLocal?: string;
    formulasR1C1?: string;
    hidden?: boolean;
    numberFormat?: string;
    rowCount?: number;
    rowHidden?: boolean;
    rowIndex?: number;
    text?: string;
    valueTypes?: string;
    values?: string;
}

export interface WorkbookRangeUpdateBody {
    columnHidden?: boolean;
    formulas?: string;
    formulasLocal?: string;
    formulasR1C1?: string;
    numberFormat?: string;
    rowHidden?: boolean;
    values?: Array<Array<any>>;
}


