import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { StatelessActionHandler } from 'runbotics-sdk';
import { MicrosoftCloudPlatform } from 'runbotics-common';
import { RunboticsLogger } from '#logger';

import { SharePointService } from '../share-point';
import { OneDriveService } from '../one-drive';
import { getContentType } from './utils';
import { FileActionRequest, MicrosoftFileUploadInput } from './types';

@Injectable() // Microsoft Cloud ?
export default class MicrosoftFileActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(MicrosoftFileActionHandler.name);

    constructor(
        private readonly sharePointService: SharePointService,
        private readonly oneDriveService: OneDriveService,
    ) {
        super();
    }

    async upload(input: MicrosoftFileUploadInput) {
        const content = fs.readFileSync(input.localFilePath, 'utf8');
        const contentType = getContentType(input.localFilePath);

        if (input.platform === MicrosoftCloudPlatform.ONE_DRIVE) {
            await this.oneDriveService.uploadFile(input.cloudFilePath, content, contentType);
        } else {
            await this.sharePointService.uploadFile(input.siteName, input.listName, input.cloudFilePath, content, contentType);
        }
    }

    run(request: FileActionRequest) {
        switch (request.script) {
            case 'microsoftFile.uploadFile':
                return this.upload(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}