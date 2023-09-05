import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service';
import { CreateItemResponse, UploadFileResponse } from './one-drive.types';
import { RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY } from './one-drive.utils';
import { bufferFromBase64 } from '../file/utils';

@Injectable()
export class OneDriveService {
    private readonly logger = new RunboticsLogger(OneDriveService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    // https://learn.microsoft.com/en-us/graph/api/driveitem-get?view=graph-rest-1.0&tabs=javascript
    getItem(itemId: string) {
        return this.microsoftGraphService
            .get(`/me/drive/items/${itemId}`);
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-delete?view=graph-rest-1.0&tabs=javascript
    deleteItemByPath(itemPath: string) {
        return this.microsoftGraphService
            .delete(`me/drive/root:/${itemPath}`);
    }

    deleteItemFromWorkingDirectory(filePath: string) {
        return this.deleteItemByPath(`${RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY}/${filePath}`);
    }

    // Up to 4MB
    // https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=javascript
    uploadFile(
        fullFilePath: string,
        content: string,
        contentType: string,
    ) {
        return this.microsoftGraphService
            .put<UploadFileResponse>(
                `/me/drive/root:/${fullFilePath}:/content`,
                bufferFromBase64(content),
                {
                    headers: {
                        'Content-Type': contentType,
                    },
                }
            );
    }

    uploadToWorkingDirectory(
        filePath: string,
        content: string,
        contentType: string,
    ) {
        const extendedFilePath = `${RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY}/${filePath}`;
        this.logger.log(`Uploading file to "${extendedFilePath}"`);
        return this.uploadFile(extendedFilePath, content, contentType);
    }
    
    createFolderInWorkingDirectory(folderName: string) {
        this.logger.log(`Creating folder "${RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY}/${folderName}"`);
        return this.createFolder(folderName, RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY);
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0&tabs=javascript
    createFolder(
        folderName: string,
        absolutePath?: string,
    ) {
        const urlPath = absolutePath ? `:/${absolutePath}:`: '';
        return this.microsoftGraphService
            .post<CreateItemResponse>(`/me/drive/root${urlPath}/children`, {
                name: folderName,
                folder: {},
                '@microsoft.graph.conflictBehavior': 'fail', // fail, replace, rename
            });
    }
}
