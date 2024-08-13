import { Drive } from '../common.types';
import { RequestOptions } from '../microsoft-graph';

export interface ODataCollection<T> {
    value: T[];
}

export interface SharePointCommon {
    siteId: Site['id'];
    driveId: Drive['id'];
}

export interface DownloadFileParams extends SharePointCommon {
    filePath: string;
    localDirectory: string;
}

export interface GetFileByPathParams extends SharePointCommon {
    filePath: string;
    options?: RequestOptions;
}

export interface CreateFolderParams extends SharePointCommon {
    folderName: string;
    parentFolderPath?: string;
}

export interface UploadFileParams extends SharePointCommon {
    filePath: string;
    content: Buffer;
    contentType: string;
}

export interface MoveFileParams extends SharePointCommon {
    filePath: string;
    destinationFolderPath: string;
}

export interface DeleteItemParams extends SharePointCommon {
    filePath: string;
}

export interface CreateShareLinkParams extends SharePointCommon {
    shareType: string;
    shareScope: string;
    itemPath: string;
}

/**
 * @see https://learn.microsoft.com/en-us/graph/api/resources/site?view=graph-rest-1.0
 */
export interface Site {
    id: string;
    displayName: string;
    description: string;
    name: string;
    createdDateTime: string;
    lastModifiedDateTime: string;
    webUrl: string;
    parentReference?: {
        siteId: string;
    },
    siteCollection?: {
        hostname: string;
    }
}

export interface SiteWithDrives extends Site {
    'drives@odata.context': string;
    drives: Drive[];
}

export interface SharepointListItem {
    createdBy: unknown;
    createdDateTime: number;
    description: string;
    eTag: string;
    id: string;
    lastModifiedBy: unknown;
    lastModifiedDateTime: number;
    name: string;
    parentReference: unknown;
    sharepointIds: unknown;
    webUrl: string;
    
    fields: Record<string, unknown>;
}
