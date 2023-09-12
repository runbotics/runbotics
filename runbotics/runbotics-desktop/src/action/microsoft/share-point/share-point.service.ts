import { Injectable } from '@nestjs/common';
import { PassThrough } from 'stream';

import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import { SiteWithDrives } from './share-point.types';
import { DriveItem } from '../common.types';

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

    getSiteWithDrives(siteName: string) {
        return this.microsoftGraphService
            .get<SiteWithDrives>(`/sites/${siteName}`, { expand: 'drive' });
    }

}
