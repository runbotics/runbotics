import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import { PassThrough } from 'stream';

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
    
}
