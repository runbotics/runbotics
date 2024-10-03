import { MicrosoftPlatform } from 'runbotics-common';

import { ActionCredentialData, Drive, DriveItem } from '../common.types';
import { Site } from '../share-point/share-point.types';

// Session
export interface OneDriveSession {
    platform: MicrosoftPlatform.OneDrive;
    fileId: DriveItem['id'];
    worksheetName: Worksheet['name'];
    workbookSessionId?: WorkbookSessionInfo['id'];
}

export interface SharePointSession extends Omit<OneDriveSession, 'platform'> {
    platform: MicrosoftPlatform.SharePoint;
    siteId: Site['id'];
    driveId: Drive['id'];
}

export type ExcelSession = (SharePointSession | OneDriveSession) & ActionCredentialData;

// Session Info
export interface OneDriveSessionInfo {
    platform: MicrosoftPlatform.OneDrive;
    filePath: string;
    worksheetName?: string;
}

export interface SharePointSessionInfo extends Omit<OneDriveSessionInfo, 'platform'> {
    platform: MicrosoftPlatform.SharePoint;
    siteRelativePath: string;
    listName: string;
}

export type ExcelSessionInfo = (OneDriveSessionInfo | SharePointSessionInfo) & ActionCredentialData;

// File Info
export type SharePointFileInfo = Omit<SharePointSession, 'worksheetName' | 'workbookSessionId'>;
export type OneDriveFileInfo = Omit<OneDriveSession, 'worksheetName' | 'workbookSessionId'>;
export type FileInfo = SharePointFileInfo | OneDriveFileInfo;

// Common

/**
 * @see https://learn.microsoft.com/en-us/graph/api/resources/workbooksessioninfo?view=graph-rest-1.0
 */
export interface WorkbookSessionInfo {
    id: string;
    persistChanges: boolean;
}

export interface WorkbookCellCoordinates {
    row: string;
    column: string;
}

export type ExcelCellValue = string | number | boolean;

export interface Range {
    address: string;
    addressLocal: string;
    columnCount: number;
    cellCount: number;
    columnHidden: boolean;
    rowHidden: boolean;
    numberFormat: string[][];
    columnIndex: number;
    text: string[][];
    formulas?: string[][];
    formulasLocal?: string[][];
    formulasR1C1?: string[][];
    hidden: boolean;
    rowCount: number;
    rowIndex: number;
    valueTypes: string[][];
    values: ExcelCellValue[][];
}

export interface WorkbookRangeUpdateBody {
    columnHidden?: boolean;
    formulas?: string;
    formulasLocal?: string;
    formulasR1C1?: string;
    numberFormat?: string;
    rowHidden?: boolean;
    values?: ExcelCellValue[][];
}

export interface Worksheet {
    id: string;
    name: string;
    position: number;
    visibility: string;
}

export interface UsedRangeResponse {
    address: string;
    columnCount: number;
    rowCount: number;
    cellCount: number;
    text: string[][];
}

export interface WorksheetContentRange extends Omit<UsedRangeResponse, 'address'> {
    startCell: string;
    endCell: string;
}
