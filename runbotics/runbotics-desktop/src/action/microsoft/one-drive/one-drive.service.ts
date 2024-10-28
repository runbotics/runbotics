import axios from 'axios';
import { IncomingMessage } from 'http';
import { createWriteStream } from 'fs';

import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service';
import { UploadFileParams, MoveFileParams, DeleteItemParams, CreateShareLinkParams } from './one-drive.types';
import { DriveItem, Permission } from '../common.types';
import { RequestOptions } from '../microsoft-graph';
import { saveFileStream, verifyDestinationPath } from '../common.utils';

export class OneDriveService {
    private readonly logger = new RunboticsLogger(OneDriveService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    async downloadFileByPath(filePath: string, localDirectory: string) {
        const driveItem = await this.getFileByPath(filePath);

        const absolutePath = verifyDestinationPath(driveItem.name, localDirectory);

        const writer = createWriteStream(absolutePath);
        const fileContent = await axios
            .get<IncomingMessage>(driveItem['@microsoft.graph.downloadUrl'], { responseType: 'stream' })
            .then(d => d.data);

        fileContent.pipe(writer);
        return saveFileStream(writer, absolutePath);
    }

    getFileByPath(filePath: string, options?: RequestOptions) {
        return this.microsoftGraphService
            .get<DriveItem>(`/me/drive/root:/${filePath}:`, options);
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-get?view=graph-rest-1.0&tabs=javascript
    getItem(itemId: string) {
        return this.microsoftGraphService
            .get<DriveItem>(`/me/drive/items/${itemId}`);
    }

    getItemByPath(path: string) {
        return this.microsoftGraphService
            .get<DriveItem>(`/me/drive/root:/${path}`);
    }

    // Up to 4MB
    // https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=javascript
    uploadFile({
        filePath, content, contentType,
    }: UploadFileParams) {
        return this.microsoftGraphService
            .put<DriveItem>(
                `/me/drive/root:/${filePath}:/content`,
                content,
                {
                    headers: {
                        'Content-Type': contentType,
                    },
                }
            );
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0&tabs=javascript
    createFolder(
        folderName: string,
        absolutePath?: string,
    ) {
        const urlPath = absolutePath ? `:/${absolutePath}:`: '';
        return this.microsoftGraphService
            .post<DriveItem>(`/me/drive/root${urlPath}/children`, {
                name: folderName,
                folder: {},
                '@microsoft.graph.conflictBehavior': 'fail',
            });
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-move?view=graph-rest-1.0&tabs=javascript
    async moveFile({
        filePath,
        destinationFolderPath,
    }: MoveFileParams) {
        const file = await this.getFileByPath(filePath);
        if (!file) {
            throw new Error('Provided file path does not exist');
        }

        const destinationFolder = await this.getItemByPath(destinationFolderPath);
        return this.microsoftGraphService
            .patch<DriveItem>(`/me/drive/items/${file.id}`, {
                parentReference: { id: destinationFolder.id }
            });
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-delete?view=graph-rest-1.0&tabs=javascript
    async deleteItem({
        itemPath,
    }: DeleteItemParams) {
        const item = await this.getItemByPath(itemPath);
        if (!item) {
            throw new Error('Provided file path does not exist');
        }

        return this.microsoftGraphService
            .delete(`/me/drive/items/${item.id}`);
    }

    //https://learn.microsoft.com/en-us/graph/api/driveitem-createlink?view=graph-rest-1.0&tabs=javascript
    async createShareLink({
        shareType,
        shareScope,
        itemPath,
    }: CreateShareLinkParams) {
        const item = await this.getItemByPath(itemPath);
        if (!item) {
            throw new Error('Provided file path does not exist');
        }

        return this.microsoftGraphService
            .post<Permission>(`/me/drive/items/${item.id}/createLink`, {
                type: shareType,
                scope: shareScope
            });
    }
}
