export interface CreateItemResponse {
    '@odata.context': string;
    '@odata.etag': string;
    id: string;
    name: string;
    eTag: string;
    cTag: string;
    createdBy: Initiator;
    lastModifiedBy: Initiator;
    createdDateTime: string;
    lastModifiedDateTime: string;
    parentReference: ParentReference;
    size: number;
    folder: {
        childCount: number;
    };
    webUrl: string;
    fileSystemInfo: {
        createDateTime: string;
        lastModifiedDateTime: string;
    };
    location: any;
    commentSettings: {
        commentingDisabled: {
            isDisabled: boolean;
        };
    };
}

interface Initiator {
    user: Individual;
    application?: Omit<Individual, 'email'>;
}

interface Individual {
    id: string;
    displayName: string;
    email: string;
}

interface ParentReference {
    driveId: string;
    driveType: string;
    id: string;
    path: string;
    sharepointIds?: {
        listId: string;
        listItemUniqueId: string;
        siteId: string;
        siteUrl: string;
        tenantId: string;
        webId: string;
    };
}

export interface UploadFileResponse {
    '@microsoft.graph.downloadUrl': string;
    '@odata.context': string;
    createdDateTime: string;
    eTag: string,
    id: string;
    lastModifiedDateTime: string;
    name: string;
    webUrl: string;
    cTag: string;
    size: number,
    createdBy: Initiator;
    lastModifiedBy: Initiator;
    parentReference: ParentReference;
    file: {
        mimeType: string;
        hashes: {
            quickXorHash: string;
        };
    };
    fileSystemInfo: {
        createdDateTime: string;
        lastModifiedDateTime: string;
    },
}