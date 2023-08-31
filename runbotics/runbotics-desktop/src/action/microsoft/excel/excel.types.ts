export type SessionIdentifier = string;
export type WorksheetIdentifier = number | string;
export type Platform = 'SharePoint' | 'OneDrive';
export interface Session {
    platform: Platform;
    sessionIdentifier: SessionIdentifier;
    worksheetIdentifier: WorksheetIdentifier;
    workbookSessionInfo: WorkbookSessionInfo;
    siteId?: string;
    driveId?: string;
    fileId?: string;
}

export interface SessionInput {
    platform: Platform,
    sessionIdentifier: SessionIdentifier,
    worksheetIdentifier: WorksheetIdentifier,
    persistChanges: boolean,
    siteRelativePath?: string,
    list?: string
}

export interface SharePointSessionInput {
    platform: Platform,
    sessionIdentifier: SessionIdentifier,
    worksheetIdentifier: WorksheetIdentifier,
    siteRelativePath?: string,
    list?: string
}

export interface WorkbookSessionInfo {
    id: string;
    persistChanges: boolean;
}

export interface WorkbookCellCoordinates {
    row: string;
    column: string;
}

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
//https://learn.microsoft.com/en-us/graph/api/resources/drive?view=graph-rest-1.0
export interface Drive {
    createdBy?: unknown;
    createdDateTime?: string;
    description?: string;
    driveType?: 'personal' | 'business' | 'documentLibrary';
    following?: Array<DriveItem>;
    id?: string;
    items?: Array<DriveItem>;
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
    activities?: Array<unknown>;
    analytics?: unknown;
    children?: Array<unknown>;
    createdByUser?: unknown;
    lastModifiedByUser?: unknown;
    permissions?: Array<unknown>;
    subscriptions?: Array<unknown>;
    thumbnails?: Array<unknown>;
    versions?: Array<unknown>;

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


