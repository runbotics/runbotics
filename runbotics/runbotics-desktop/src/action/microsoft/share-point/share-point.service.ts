import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import { Site, Drive, DriveItem } from './share-point.types';
import { bufferFromBase64 } from '../file/utils';

@Injectable()
export class SharePointService {
    private readonly logger = new RunboticsLogger(SharePointService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    /**
     * 1. download file id/path
     * 2. upload file
     * 3. download multiple files
     * 4. create folder
     */
    
    // https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=javascript
    async uploadFile(siteName: string, listName: string, fullFilePath: string, content: string, contentType: string) {
        const siteId = await this.getSiteIdByName(siteName);
        const driveId = await this.getDriveIdBySiteAndListName(siteId, listName);
        const itemId = this.getItemId(siteId, driveId, fullFilePath);

        return this.microsoftGraphService.put<DriveItem>(`/sites/${siteId}/drive/items/${itemId}:/${fullFilePath}:/content`,
            bufferFromBase64(content),
            { 
                headers: {
                    'Content-Type': contentType
                }
            }
        );
    }

    async getSiteIdByName(siteName: string) {
        const url = `/sites?search=${siteName}`;
        
        const data: Site = (await this.microsoftGraphService.get(url))['value'][0];
        if (data === undefined) {
            throw new Error(`Site ${siteName} not found`);
        }
        return data.id;
    }

    async getDriveIdBySiteAndListName(siteId: string, listName: string) {
        const url = `/sites/${siteId}/drives/`;

        const data = (await this.microsoftGraphService.get(url))['value'] as Drive[];
        if (data === undefined) {
            throw new Error(`List ${listName} not found`);
        }
        return data.filter(drive => drive.name === listName)[0].id;
    }

    async getItemId(siteId: string, driveId: string, filePath: string) {
        const url = `/sites/${siteId}/drives/${driveId}/root:/${filePath}`;

        const data: DriveItem = await this.microsoftGraphService.get(url);
        if (data === undefined) {
            throw new Error(`File path ${filePath} not found`);
        }
        return data.id;
    }
}
