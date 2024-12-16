import axios from 'axios';
import { createWriteStream } from 'fs';
import { IncomingMessage } from 'http';

import { CollectionResponse, MicrosoftGraphService } from '../microsoft-graph';
import {
    CreateFolderParams, DownloadFileParams, GetFileByPathParams,
    Site, UploadFileParams, MoveFileParams, DeleteItemParams,
    CreateShareLinkParams, ODataCollection, SharepointListItem,
} from './share-point.types';
import { Drive, DriveItem, Permission } from '../common.types';
import { saveFileStream, verifyDestinationPath } from '../common.utils';

export class SharePointService {
    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    async getListItems (siteId: string, listName: string): Promise<SharepointListItem[]> {
        const result = await this.microsoftGraphService
            .get(`/sites/${siteId}/lists/${listName}/items?expand=fields`) as ODataCollection<SharepointListItem>;
        return result.value;
    }

    async downloadFileByPath({
        siteId, driveId, filePath, localDirectory,
    }: DownloadFileParams) {
        const driveItem = await this.getFileByPath({ siteId, driveId, filePath });

        const absolutePath = verifyDestinationPath(driveItem.name, localDirectory);

        const writer = createWriteStream(absolutePath);
        const fileContent = await axios
            .get<IncomingMessage>(driveItem['@microsoft.graph.downloadUrl'], { responseType: 'stream' })
            .then(d => d.data);

        fileContent.pipe(writer);
        return saveFileStream(writer, absolutePath);
    }

    getFileByPath({
        siteId, driveId, filePath, options,
    }: GetFileByPathParams) {
        const url = `/sites/${siteId}/drives/${driveId}/root:/${filePath}`;

        return this.microsoftGraphService.get<DriveItem>(url, options);
    }

    async getSiteByRelativePath(siteRelativePath: string) {
        const rootSite = await this.getRootSite();
        return this.microsoftGraphService
            .get<Site>(`/sites/${rootSite?.siteCollection?.hostname}:${siteRelativePath}`);
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
        siteId, driveId, filePath, content, contentType,
    }: UploadFileParams) {
        return this.microsoftGraphService
            .put<DriveItem>(
                `/sites/${siteId}/drives/${driveId}/root:/${filePath}:/content`,
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
        siteId, driveId, filePath, destinationFolderPath
    }: MoveFileParams){
        const file = await this.getFileByPath({
            siteId, driveId, filePath
        });
        if (!file) {
            throw new Error('Provided file path does not exist');
        }

        const destinationFolder = await this.microsoftGraphService
            .get<DriveItem>(
                `/sites/${siteId}/drives/${driveId}/root:/${destinationFolderPath}`
            );

        return this.microsoftGraphService
            .patch<DriveItem>(`/sites/${siteId}/drives/${driveId}/items/${file.id}`, {
                parentReference: { id: destinationFolder.id }
            });
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-delete?view=graph-rest-1.0&tabs=javascript
    async deleteItem({
        siteId, driveId, filePath,
    }: DeleteItemParams) {
        const item = await this.getFileByPath({
            siteId, driveId, filePath,
        });
        if (!item) {
            throw new Error('Provided file path does not exist');
        }

        return this.microsoftGraphService
            .delete(`/sites/${siteId}/drives/${driveId}/items/${item.id}`);
    }

    // https://learn.microsoft.com/en-us/graph/api/driveitem-createlink?view=graph-rest-1.0&tabs=javascript
    async createShareLink({
        siteId, driveId, shareType, shareScope, itemPath,
    }: CreateShareLinkParams) {
        const item = await this.getFileByPath({
            siteId, driveId, filePath: itemPath,
        });
        if (!item) {
            throw new Error('Provided file path does not exist');
        }

        console.log(shareType, shareScope);
        return this.microsoftGraphService
            .post<Permission>(`/sites/${siteId}/drives/${driveId}/items/${item.id}/createLink`, {
                type: shareType,
                scope: shareScope
            });
    }

    private getRootSite() {
        return this.microsoftGraphService
            .get<Site>('/sites/root');
    }
}
