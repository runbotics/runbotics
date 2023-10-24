import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from 'runbotics-sdk';
import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';
import { fromFile } from 'file-type';

import { OneDriveService } from '#action/microsoft/one-drive';
import { SharePointService } from '#action/microsoft/share-point';
import { RunboticsLogger } from '#logger';

import {
    CloudFileActionRequest, CloudFileCreateFolderActionInput,
    CloudFileDownloadFileActionInput, CloudFileMoveFileActionInput,
    CloudFileUploadFileActionInput, SharePointDownloadFileActionInput,
    CloudFileDeleteItemActionInput, CloudFileCreateShareLink
} from './cloud-file.types';
import { ServerConfigService } from '#config';
import { readFileSync } from 'fs';

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
            return this.oneDriveService.downloadFileByPath(input.filePath, localDirectory);
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName,
        });

        return this.sharePointService.downloadFileByPath({
            siteId: site.id,
            driveId: drive.id,
            filePath: input.filePath,
            localDirectory,
        });
    }

    async uploadFile(input: CloudFileUploadFileActionInput) {
        const fileName = input.filePath.split('/').at(-1);
        const localPath = `${input.localParentFolderPath ?? this.serverConfigService.tempFolderPath}/${fileName}`;
        const { content, contentType } = await this.readLocalFile(localPath);

        if (input.platform === MicrosoftPlatform.OneDrive) {
            return this.oneDriveService.uploadFile({
                filePath: input.filePath,
                content,
                contentType,
            });
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName,
        });

        return this.sharePointService.uploadFile({
            siteId: site.id,
            driveId: drive.id,
            filePath: input.filePath,
            content,
            contentType,
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

    async moveFile(input: CloudFileMoveFileActionInput) {
        if (input.platform === MicrosoftPlatform.OneDrive) {
            await this.oneDriveService.moveFile({
                filePath: input.filePath,
                destinationFolderPath: input.destinationFolderPath,
            });
        } else {
            const { site, drive } = await this.getSharePointListInfo({
                listName: input.listName,
                siteName: input.siteName
            });

            await this.sharePointService.moveFile({
                siteId: site.id,
                driveId: drive.id,
                filePath: input.filePath,
                destinationFolderPath: input.destinationFolderPath
            });
        }
    }

    async deleteItem(input: CloudFileDeleteItemActionInput) {
        if (input.platform === MicrosoftPlatform.OneDrive) {
            return this.oneDriveService.deleteItem({
                itemPath: input.itemPath,
            });
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName
        });

        return this.sharePointService.deleteItem({
            siteId: site.id,
            driveId: drive.id,
            filePath: input.itemPath,
        });
    }

    async createShareLink(input: CloudFileCreateShareLink) {
        if (input.platform === MicrosoftPlatform.OneDrive) {
            const response = await this.oneDriveService.createShareLink({
                shareType: input.shareType.toLowerCase(),
                shareScope: input.shareScope.toLowerCase(),
                itemPath: input.itemPath,
            });

            return response.link.webUrl;
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteName: input.siteName
        });

        const response = await this.sharePointService.createShareLink({
            siteId: site.id,
            driveId: drive.id,
            shareType: input.shareType.toLowerCase(),
            shareScope: input.shareScope.toLowerCase(),
            itemPath: input.itemPath,
        });

        return response.link.webUrl;
    }

    run(request: CloudFileActionRequest) {
        switch (request.script) {
            case CloudFileAction.DOWNLOAD_FILE:
                return this.downloadFile(request.input);
            case CloudFileAction.UPLOAD_FILE:
                return this.uploadFile(request.input);
            case CloudFileAction.CREATE_FOLDER:
                return this.createFolder(request.input);
            case CloudFileAction.MOVE_FILE:
                return this.moveFile(request.input);
            case CloudFileAction.DELETE_ITEM:
                return this.deleteItem(request.input);
            case CloudFileAction.CREATE_SHARE_LINK:
                return this.createShareLink(request.input);
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
        const content = readFileSync(path);
        const { mime } = await fromFile(path);

        return {
            content,
            contentType: mime,
        };
    }
}
