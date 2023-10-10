import { Drive } from '../common.types';
import { RequestOptions } from '../microsoft-graph';

export interface SharePointCommon {
    siteId: Site['id'];
    driveId: Drive['id'];
}

export interface DownloadFileParams extends SharePointCommon {
    fileName: string;
    localDirectory: string;
    parentFolderPath?: string;
}

export interface GetFileByPathParams extends SharePointCommon {
    fileName: string;
    parentFolderPath?: string;
    options?: RequestOptions;
}

export interface CreateFolderParams extends SharePointCommon {
    folderName: string;
    parentFolderPath?: string;
}

export interface UploadFileParams extends SharePointCommon {
    fileName: string;
    content: Buffer;
    contentType: string;
    parentFolderPath?: string;
}

export interface MoveFileParams extends SharePointCommon {
    fileName: string;
    destinationFolderPath: string;
    parentFolderPath?: string;
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
    parentReference: {
        siteId: string;
    }
}

export interface SiteWithDrives extends Site {
    'drives@odata.context': string;
    drives: Drive[];
}
