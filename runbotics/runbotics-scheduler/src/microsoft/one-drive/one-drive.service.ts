import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service';
import { CreateItemResponse, UploadFileResponse } from './one-drive.types';
import { RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY } from './one-drive.utils';

@Injectable()
export class OneDriveService implements OnModuleInit {
    private readonly logger = new Logger(OneDriveService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    onModuleInit() {
        this.initializeWorkingDirectory();
    }

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
                this.bufferFromBase64(content),
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
        return this.uploadFile(`${RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY}/${filePath}`, content, contentType);
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

    private initializeWorkingDirectory() {
        return this.createFolder(RUNBOTICS_ONE_DRIVE_WORKING_DIRECTORY)
            .then(() => {
                this.logger.log('Working directory created');
            })
            .catch((e) => {
                this.logger.error('Failed to create One Drive working directory:', e.message);
            });
    }

    private bufferFromBase64(base64File: string) {
        if (base64File.includes('base64,')) {
            return Buffer.from(base64File.split(';base64,').pop(), 'base64');
        }
        return Buffer.from(base64File, 'base64');
    }
}
