//https://learn.microsoft.com/en-us/graph/api/resources/drive?view=graph-rest-1.0
export interface Drive {
    createdDateTime: string;
    description: string;
    id: string;
    lastModifiedDateTime: string;
    name: string;
    webUrl: string;
    driveType: 'personal' | 'business' | 'documentLibrary';
    createdBy: unknown;
    lastModifiedBy: unknown;
    owner: unknown;
    quota: unknown;
    following?: DriveItem[];
    items?: DriveItem[];
    root?: unknown;
    sharepointIds?: unknown;
    special?: unknown;
    system?: unknown;
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
    size?: number;
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
    createdDateTime: string;
    eTag: string;
    id: string;
    lastModifiedDateTime: string;
    name: string;
    webUrl: string;
    createdBy: unknown;
    lastModifiedBy: unknown;
    parentReference: unknown;

    /* instance annotations */
    '@microsoft.graph.conflictBehavior'?: string;
    '@microsoft.graph.downloadUrl'?: string;
    '@microsoft.graph.sourceUrl'?: string;
}
