import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from 'runbotics-sdk';
import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';
import { readFile } from 'fs/promises';
import { fromFile } from 'file-type';

import { OneDriveService } from '#action/microsoft/one-drive';
import { SharePointService } from '#action/microsoft/share-point';
import { RunboticsLogger } from '#logger';

import {
    CloudFileActionRequest, CloudFileCreateFolderActionInput,
    CloudFileDownloadFileActionInput,
    CloudFileUploadFileActionInput, SharePointDownloadFileActionInput,
} from './cloud-file.types';
import { ServerConfigService } from '#config';

@Injectable()
export class CloudFileActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(CloudFileActionHandler.name);

    constructor(
        private readonly oneDriveService: OneDriveService,
        private readonly sharePointService: SharePointService,
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }
    
    async downloadFile(input: CloudFileDownloadFileActionInput) {
        const localDirectory = input.localDirectory ?? this.serverConfigService.tempFolderPath;

        if (input.platform === MicrosoftPlatform.OneDrive) {
            return this.oneDriveService.downloadFileByPath(input.fileName, localDirectory, input.parentFolderPath);
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName,
        });

        return this.sharePointService.downloadFileByPath({
            siteId: site.id,
            driveId: drive.id,
            fileName: input.fileName,
            localDirectory,
            parentFolderPath: input.parentFolderPath,
        });
    }

    async uploadFile(input: CloudFileUploadFileActionInput) {
        const localPath = `${input.localParentFolderPath ?? this.serverConfigService.tempFolderPath}/${input.fileName}`;
        const { content, contentType } = await this.readLocalFile(localPath);
    
        if (input.platform === MicrosoftPlatform.OneDrive) {
            return this.oneDriveService.uploadFile({
                fileName: input.fileName,
                content,
                contentType,
                parentFolderPath: input.parentFolderPath,
            });
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName,
        });

        return this.sharePointService.uploadFile({
            siteId: site.id,
            driveId: drive.id,
            fileName: input.fileName,
            content,
            contentType,
            parentFolderPath: input.parentFolderPath,
        });
    }

    async createFolder(input: CloudFileCreateFolderActionInput) {
        if (input.platform === MicrosoftPlatform.OneDrive) {
            return this.oneDriveService.createFolder(input.folderName, input.parentFolderPath);
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName,
        });

        return this.sharePointService.createFolder({
            siteId: site.id,
            driveId: drive.id,
            folderName: input.folderName,
            parentFolderPath: input.parentFolderPath,
        });
    }
    
    run(request: CloudFileActionRequest) {
        switch (request.script) {
            case CloudFileAction.DOWNLOAD_FILE:
                return this.downloadFile(request.input);
            case CloudFileAction.UPLOAD_FILE:
                return this.uploadFile(request.input);
            case CloudFileAction.CREATE_FOLDER:
                return this.createFolder(request.input);
            default:
                throw new Error('Action not found');
        }
    }

    private async getSharePointListInfo({ listName, siteName }: Pick<SharePointDownloadFileActionInput, 'siteName' | 'listName'>) {
        const site = await this.sharePointService.getSitesByName(siteName)
            .then(response => response.value[0]);
        if (!site) {
            throw new Error(`Site ${siteName} not found`);
        }

        const drive = await this.sharePointService.getSiteDrives(site.id)
            .then(response => response.value)
            .then(drives => drives.find(drive => drive.name === listName));

        if (!drive) {
            throw new Error(`Site ${siteName} does not contain "${listName}" list or "${listName}" is not a list of type "Document library"`);
        }

        return {
            site,
            drive,
        };
    }

    private async readLocalFile(path: string) {
        const content = await readFile(path);
        const { mime } = await fromFile(path);

        return {
            content,
            contentType: mime,
        };
    }
}
