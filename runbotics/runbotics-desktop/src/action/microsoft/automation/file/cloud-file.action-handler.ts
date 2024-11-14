import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';
import mimeTypes from 'mime-types';

import { OneDriveService } from '#action/microsoft/one-drive';
import { SharePointService } from '#action/microsoft/share-point';

import {
    CloudFileActionRequest,
    CloudFileCreateFolderActionInput,
    CloudFileDownloadFileActionInput,
    CloudFileMoveFileActionInput,
    CloudFileUploadFileActionInput,
    CloudFileDeleteItemActionInput,
    CloudFileCreateShareLink,
    SharePointCommon,
    SharepointGetListItems,
} from './cloud-file.types';
import { MicrosoftAuth, ServerConfigService } from '#config';
import { readFileSync } from 'fs';
import path from 'path';
import { MicrosoftGraphService } from '#action/microsoft/microsoft-graph';
import { MicrosoftAuthService } from '#action/microsoft/microsoft-auth.service';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';

@Injectable()
export class CloudFileActionHandler extends StatelessActionHandler {
    private microsoftGraphService: MicrosoftGraphService = null;
    private oneDriveService: OneDriveService = null;
    private sharePointService: SharePointService = null;

    constructor(
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
            siteRelativePath: input.siteRelativePath,
        });

        return this.sharePointService.downloadFileByPath({
            siteId: site.id,
            driveId: drive.id,
            filePath: input.filePath,
            localDirectory,
        });
    }

    async uploadFile(input: CloudFileUploadFileActionInput) {
        const fileName = input.filePath.split(path.sep).at(-1);
        const { content, contentType } = this.readLocalFile(input.filePath);

        const cloudFilePath = `${input.cloudDirectoryPath}/${fileName}`;

        if (input.platform === MicrosoftPlatform.OneDrive) {
            await this.oneDriveService.uploadFile({
                filePath: cloudFilePath,
                content,
                contentType,
            });
            return cloudFilePath;
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteRelativePath: input.siteRelativePath,
        });

        await this.sharePointService.uploadFile({
            siteId: site.id,
            driveId: drive.id,
            filePath: cloudFilePath,
            content,
            contentType,
        });
        return cloudFilePath;
    }

    async createFolder(input: CloudFileCreateFolderActionInput) {
        if (input.platform === MicrosoftPlatform.OneDrive) {
            return this.oneDriveService.createFolder(input.folderName, input.parentFolderPath);
        }

        const { site, drive } = await this.getSharePointListInfo({
            listName: input.listName,
            siteRelativePath: input.siteRelativePath,
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
                siteRelativePath: input.siteRelativePath,
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
            siteRelativePath: input.siteRelativePath,
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
            siteRelativePath: input.siteRelativePath,
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
        const matchedCredential =
            credentialAttributesMapper<MicrosoftAuth>(request.credentials);

        // @todo After completion of password manager switch fully to matchedCredential
        const credential: MicrosoftAuth =
            matchedCredential ??
            this.serverConfigService.microsoftAuth;

        const matchedCredentials = {
            config: {
                auth: {
                    clientId: credential.clientId,
                    authority: credential.tenantId,
                    clientSecret: credential.clientSecret,
                }
            },
            loginCredential: {
                username: credential.username,
                password: credential.password,
            }
        };

        this.createSession(matchedCredentials);

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
            case CloudFileAction.GET_SHAREPOINT_LIST_ITEMS:
                return this.getSharepointListItems(request.input);
            default:
                throw new Error('Action not found');
        }
    }

    private createSession(matchedCredentials) {
        this.microsoftGraphService = new MicrosoftGraphService(
            new MicrosoftAuthService(
                matchedCredentials,
            )
        );

        this.sharePointService = new SharePointService(this.microsoftGraphService);
        this.oneDriveService = new OneDriveService(this.microsoftGraphService);
    }

    private async getSharePointListInfo({ listName, siteRelativePath }: Omit<SharePointCommon, 'platform'>) {
        const site = await this.sharePointService.getSiteByRelativePath(siteRelativePath);
        if (!site) {
            throw new Error(`Site for provided path "${siteRelativePath}" not found`);
        }

        const drive = await this.sharePointService.getSiteDrives(site.id)
            .then(response => response.value)
            .then(drives => drives.find(drive => drive.name === listName));

        if (!drive) {
            throw new Error(`Provided site path "${siteRelativePath}" does not contain "${listName}" list or "${listName}" is not a list of type "Document library"`);
        }

        return {
            site,
            drive,
        };
    }

    private readLocalFile(filePath: string) {
        const content = readFileSync(filePath);
        const mime = mimeTypes.lookup(filePath);
        if (!mime) {
            throw new Error('Unable to determine the mime type');
        }

        return {
            content,
            contentType: mime,
        };
    }

    private async getSharepointListItems({ listName, siteRelativePath }: SharepointGetListItems) {
        const site = await this.sharePointService.getSiteByRelativePath(siteRelativePath);
        if (!site) {
            throw new Error(`Site for provided path "${siteRelativePath}" not found`);
        }

        return this.sharePointService.getListItems(site.id, listName);
    }
}
