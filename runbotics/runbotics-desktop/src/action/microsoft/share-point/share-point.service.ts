import { Injectable } from '@nestjs/common';
import { PassThrough } from 'stream';

import { RunboticsLogger } from '#logger';

import { CollectionResponse, MicrosoftGraphService } from '../microsoft-graph';
import { Site } from './share-point.types';
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

    getDriveItem(siteId: string, driveId: string, path: string) {
        const url = `/sites/${siteId}/drives/${driveId}/root:/${path}`;

        return this.microsoftGraphService.get<DriveItem>(url);
    }

    getSiteByName(siteName: Site['name']) {
        return this.microsoftGraphService
            .get<CollectionResponse<Site>>('/sites', { search: siteName });
    }

    getSiteDrives(siteId: Site['id']) {
        return this.microsoftGraphService
            .get<CollectionResponse<Drive>>(`/sites/${siteId}/drives`);
    }
}
