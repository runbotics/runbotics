export type SessionIdentifier = string;
export type WorksheetIdentifier = number | string;
export type Platform = 'SharePoint' | 'OneDrive';
export type ExcelCellValue = string | number | boolean;

export interface BaseSession {
    platform: Platform;
    sessionIdentifier: SessionIdentifier;
    worksheetIdentifier: WorksheetIdentifier;
}

export interface SharePointSession extends BaseSession {
    site?: string,
    list?: string
}

export type SessionInput = BaseSession | SharePointSession;

export type Session = BaseSession & {
    workbookSessionInfo: WorkbookSessionResponse;
    siteId?: string;
    driveId?: string;
    fileId?: string;
}

export interface WorkbookSessionResponse {
    '@odata.context': string;
    id: string;
    persistChanges: boolean;
}

export interface WorkbookCellCoordinates {
    row: string;
    column: string;
}

// TODO: move to sharepoint service types
//https://graph.microsoft.com/v1.0/$metadata#sites/$entity
export interface Site {
    id?: string;
    displayName?: string;
    /* inherited from baseItem */
    name?: string;
    createdDateTime?: string;
    lastModifiedDateTime?: string;
    webUrl?: string;
}

// TODO: move to one drive service types
//https://learn.microsoft.com/en-us/graph/api/resources/drive?view=graph-rest-1.0
export interface Drive {
    createdBy?: unknown;
    createdDateTime?: string;
    description?: string;
    driveType?: 'personal' | 'business' | 'documentLibrary';
    following?: DriveItem[];
    id?: string;
    items?: DriveItem[];
    lastModifiedBy?: unknown;
    lastModifiedDateTime?: string;
    name?: string;
    owner?: unknown;
    quota?: unknown;
    root?: unknown;
    sharepointIds?: unknown;
    special?: unknown;
    system?: unknown;
    webUrl?: string;
}

// TODO: move to one drive service types
//https://learn.microsoft.com/en-us/graph/api/resources/driveitem?view=graph-rest-1.0
export interface DriveItem {
    audio?: unknown;
    bundle?: unknown;
    content?: unknown;
    cTag?: string;
    deleted?: unknown;
    description?: string;
    file?: unknown;
    fileSystemInfo?: unknown;
    folder?: unknown;
    image?: unknown;
    location?: unknown;
    malware?: unknown;
    package?: unknown;
    pendingOperations?: unknown;
    photo?: unknown;
    publication?: unknown;
    remoteItem?: unknown;
    root?: unknown;
    searchResult?: unknown;
    shared?: unknown;
    sharepointIds?: unknown;
    size?: 1024;
    specialFolder?: unknown;
    video?: unknown;
    webDavUrl?: string;
    /*relationships */
    activities?: unknown[];
    analytics?: unknown;
    children?: unknown[];
    createdByUser?: unknown;
    lastModifiedByUser?: unknown;
    permissions?: unknown[];
    subscriptions?: unknown[];
    thumbnails?: unknown[];
    versions?: unknown[];

    /* inherited from baseItem */
    createdBy?: unknown;
    createdDateTime?: string;
    eTag?: string;
    id?: string;
    lastModifiedBy?: unknown;
    lastModifiedDateTime?: string;
    name?: string;
    parentReference?: unknown;
    webUrl?: string;

    /* instance annotations */
    '@microsoft.graph.conflictBehavior'?: string;
    '@microsoft.graph.downloadUrl'?: string;
    '@microsoft.graph.sourceUrl'?: string;
}

export interface Range {
    address?: string;
    addressLocal?: string;
    cellCount?: number;
    columnCount?: number;
    columnHidden?: boolean;
    columnIndex?: number;
    formulas?: string[][];
    formulasLocal?: string[][];
    formulasR1C1?: string[][];
    hidden?: boolean;
    numberFormat?: string[][];
    rowCount?: number;
    rowHidden?: boolean;
    rowIndex?: number;
    text?: string[][];
    valueTypes?: string[][];
    values?: ExcelCellValue[][];
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
    '@odata.id': string;
    id: string;
    name: string;
    position: number;
    visibility: string;
}
