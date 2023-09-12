import { Injectable } from '@nestjs/common';
import { PassThrough } from 'stream';

import { RunboticsLogger } from '#logger';

import { CollectionResponse, MicrosoftGraphService } from '../microsoft-graph';
import { Site, SiteWithDrives } from './share-point.types';
import { Drive, DriveItem } from '../common.types';

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

    downloadById(siteId: string, itemId: string) {
        return this.microsoftGraphService
            .get<PassThrough>(`/sites/${siteId}/drive/items/${itemId}/content`);
    }
    
    getSiteIdByName(name: string) {
        const url = `/sites?search=${name}`;

        return this.microsoftGraphService.get<CollectionResponse<Site>>(url)
            .then(response => response.value[0]);
    }

    getDriveIdBySiteAndListName(siteId: string, listName: string): Promise<string | undefined> {
        const url = `/sites/${siteId}/drives/`;

        return this.microsoftGraphService.get<CollectionResponse<Drive>>(url)
            .then(response => response.value)
            .then(drives => drives
                .find(drive => drive.name === listName)?.id
            );
    }

    getDriveItem(siteId: string, driveId: string, path: string) {
        const url = `/sites/${siteId}/drives/${driveId}/root:/${path}`;

        return this.microsoftGraphService.get<DriveItem>(url);
    }

    getListName(siteId: string) {
        const url = `/sites/${siteId}/drive`;

        return this.microsoftGraphService.get<Drive>(url)
            .then(response => response?.name);
    }

    getSiteWithDrives(siteName: string) {
        return this.microsoftGraphService
            .get<SiteWithDrives>(`/sites/${siteName}`, { expand: 'drive' });
    }

}
