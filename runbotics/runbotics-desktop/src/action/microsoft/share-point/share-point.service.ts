import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { IncomingMessage } from 'http';

import { RunboticsLogger } from '#logger';

import { CollectionResponse, MicrosoftGraphService } from '../microsoft-graph';
import {
    CreateFolderParams, DownloadFileParams, GetFileByPathParams,
    Site, UploadFileParams, MoveFileParams, DeleteItemParams
} from './share-point.types';
import { Drive, DriveItem } from '../common.types';
import { saveFileStream, verifyDestinationPath } from '../common.utils';

@Injectable()
export class SharePointService {
    private readonly logger = new RunboticsLogger(SharePointService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    async downloadFileByPath({
        siteId, driveId, fileName, parentFolderPath, localDirectory,
    }: DownloadFileParams) {
        const driveItem = await this.getFileByPath({ siteId, driveId, fileName, parentFolderPath });

        const absolutePath = verifyDestinationPath(driveItem.name, localDirectory);

        const writer = createWriteStream(absolutePath);
        const fileContent = await axios
            .get<IncomingMessage>(driveItem['@microsoft.graph.downloadUrl'], { responseType: 'stream' })
            .then(d => d.data);

        fileContent.pipe(writer);
        return saveFileStream(writer, absolutePath);
    }

    getFileByPath({
        siteId, driveId, fileName, parentFolderPath, options,
    }: GetFileByPathParams) {
        const path = parentFolderPath ? `${parentFolderPath}/${fileName}` : fileName;
        const url = `/sites/${siteId}/drives/${driveId}/root:/${path}`;

        return this.microsoftGraphService.get<DriveItem>(url, options);
    }

    getSitesByName(siteName: Site['name']) {
        return this.microsoftGraphService
            .get<CollectionResponse<Site>>('/sites', { search: siteName });
    }

    getSiteDrives(siteId: Site['id']) {
        return this.microsoftGraphService
            .get<CollectionResponse<Drive>>(`/sites/${siteId}/drives`);
    }

    createFolder({ siteId, driveId, parentFolderPath, folderName }: CreateFolderParams) {
        const path = parentFolderPath ? `:/${parentFolderPath}:`: '';
        return this.microsoftGraphService
            .post<DriveItem>(`/sites/${siteId}/drives/${driveId}/root${path}/children`, {
                name: folderName,
                folder: {},
                '@microsoft.graph.conflictBehaviour': 'fail'
            });
    }

    // Up to 4MB
    // https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=javascript
    uploadFile({
        siteId, driveId, fileName, content, contentType, parentFolderPath,
    }: UploadFileParams) {
        const fullFilePath = parentFolderPath ? `${parentFolderPath}/${fileName}` : fileName;
        return this.microsoftGraphService
            .put<DriveItem>(
                `/sites/${siteId}/drives/${driveId}/root:/${fullFilePath}:/content`,
                content,
                {
                    headers: {
                        'Content-Type': contentType,
                    },
                }
            );
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-move?view=graph-rest-1.0&tabs=javascript
    async moveFile({
        siteId, driveId, fileName, parentFolderPath, destinationFolderPath
    }: MoveFileParams){
        const file = await this.getFileByPath({
            siteId, driveId, fileName, parentFolderPath
        });
        if (!file) {
            throw new Error('Provided file path does not exist');
        }

        const destinationFolder = await this.microsoftGraphService
            .get<DriveItem>(
                `/sites/${siteId}/drives/${driveId}/root:/${destinationFolderPath}`
            );

        this.microsoftGraphService
            .patch<DriveItem>(`/sites/${siteId}/drives/${driveId}/items/${file.id}`, {
                parentReference: { id: destinationFolder.id }
            });
    }

    async deleteItem({
        siteId, driveId, itemName, parentFolderPath
    }: DeleteItemParams) {
        const item = await this.getFileByPath({
            siteId, driveId, fileName: itemName, parentFolderPath
        });
        if (!item) {
            throw new Error('Provided file path does not exist');
        }

        return this.microsoftGraphService
            .delete(`/sites/${siteId}/drives/${driveId}/items/${item.id}`);
    }
}
