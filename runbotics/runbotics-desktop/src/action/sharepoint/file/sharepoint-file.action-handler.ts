import { Injectable } from '@nestjs/common';
import fs, { createWriteStream } from 'fs';
import path from 'path';
import { StatelessActionHandler } from 'runbotics-sdk';

import { externalAxios } from '#config';
import { RunboticsLogger } from '#logger';
import { MicrosoftSession, MicrosoftService, CloudPath } from '#action/microsoft';

import * as SharepointFileTypes from './types';

@Injectable()
export default class SharepointFileActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(SharepointFileActionHandler.name);

    constructor(
        private readonly microsoftSession: MicrosoftSession,
        private readonly microsoftService: MicrosoftService,
    ) {
        super();
    }

    async downloadFromRoot(
        input: SharepointFileTypes.SharepointDownloadFromRootActionInput
    ): Promise<SharepointFileTypes.SharepointDownloadActionOutput> {
        const token = await this.microsoftSession.getToken();
        const sharepointFileId = await this.microsoftService.getFileIdByPath(token.token, CloudPath.ROOT, input.filePath);
        const sharepointDownloadLink = await this.microsoftService.getDownloadFileLink(token.token, sharepointFileId);

        // const downloadFile = (uri, filename) => {
        //     return new Promise((resolve, reject) => {
        //         request.head(uri, function(err, res, body){
        //             request(uri).pipe(fs.createWriteStream(`${input.path}//${filename}`)).on('close', () => resolve(input.fileName));
        //         });
        //     })
        // };

        const temp = input.filePath.split('/');
        const sharepointFileName = temp[temp.length - 1];
        const pathToSave = input.localPath ?? path.join('./', 'temp');
        await this.downloadFile(sharepointDownloadLink, path.join(pathToSave, sharepointFileName));

        return path.join(pathToSave, sharepointFileName);
    }

    async downloadFromSite(
        input: SharepointFileTypes.SharepointDownloadFromSiteActionInput,
    ): Promise<SharepointFileTypes.SharepointDownloadActionOutput> {
        const token = await this.microsoftSession.getToken();
        const sharepointSiteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);
        const sharepointDownloadLink = await this.microsoftService.getDownloadFileLinkFromSite(token.token, input.fileName, input.folderPath);
        const pathToSave = input.localPath ?? path.join('./', 'temp');

        await this.downloadFile(sharepointDownloadLink, path.join(pathToSave, input.fileName));

        return path.join(pathToSave, input.fileName);
    }

    async upload(
        input: SharepointFileTypes.SharepointUploadActionInput
    ): Promise<SharepointFileTypes.SharepointUploadActionOutput> {
        const sharepointFilePath = input.filePath;
        const cloudPath = input.cloudPath;
        const content = fs.readFileSync(input.localPath);
        const allContentTypes = [
            {
                key: '.docx',
                value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
            { key: '.xlsx', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            { key: '.pptx', value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
            { key: '.xlsm', value: 'application/vnd.ms-excel.sheet.macroEnabled.12' },
            { key: '.pdf', value: 'application/pdf' },
            { key: '.txt', value: 'text/plain' },
        ];
        const extension = path.extname(sharepointFilePath);
        if (!extension) {
            throw new Error('File path needs to specify extension, e.g. file.pptx');
        }
        const contentType = allContentTypes.find((t) => t.key === extension).value;
        const token = await this.microsoftSession.getToken();
        if (cloudPath === CloudPath.SITE) {
            const sharepointSiteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
            const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);
        }

        await this.microsoftService.uploadFile(token.token, sharepointFilePath, cloudPath, contentType, content);

        return 'File uploaded successfully';
    }

    async getSharepointSiteConnection(
        input: SharepointFileTypes.SharepointSiteConnectionActionInput,
    ): Promise<SharepointFileTypes.SharepointSiteConnectionActionOutput> {
        const token = await this.microsoftSession.getToken();
        const sharepointSiteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        const sharepointListId = await this.microsoftService.getListId(token.token, sharepointSiteId, input.listName);
        const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);
        return { siteId: sharepointSiteId, driveId: sharepointDriveId, listId: sharepointListId };
    }

    async downloadFile(fileUrl: string, outputLocationPath: string): Promise<any> {
        const writer = createWriteStream(outputLocationPath);

        return externalAxios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        }).then((response) => {
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error = null;
                writer.on('error', (err) => {
                    error = err;
                    writer.close();
                    reject(err);
                });
                writer.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            });
        });
    }

    async downloadFiles(
        input: SharepointFileTypes.SharepointDownloadFilesInput
    ): Promise<SharepointFileTypes.SharepointDownloadFilesOutput> {
        const token = await this.microsoftSession.getToken();
        const sharepointSiteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        const sharepointListId = await this.microsoftService.getListId(token.token, sharepointSiteId, input.listName);
        const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);

        const fileNames = await this.microsoftService.getItemListByField(input.fieldName, input.fieldValue);
        for (const fileName of fileNames) {
            const sharepointDownloadLink = await this.microsoftService.getDownloadFileLinkFromSite(token.token, fileName);

            // const downloadFile = (uri, filename) => {
            //     return new Promise((resolve, reject) => {
            //         try {
            //             request.head(uri, function(err, res, body){
            //                 console.log('content-type:', res.headers['content-type']);
            //                 console.log('content-length:', res.headers['content-length']);
            //                 request(uri).pipe(fs.createWriteStream(`${input.storeDirectory}//${filename}`)).on('close', () => {
            //                     resolve(filename);
            //                 });
            //             });
            //         } catch (e) {
            //             reject(e)
            //         }
            //     })
            // };

            await this.downloadFile(sharepointDownloadLink, path.join(input.storeDirectory, fileName));
            this.logger.log(`File ${fileName} downloaded`);
        }
        return fileNames;
    }

    async createFolder(
        input: SharepointFileTypes.SharepointCreateFolderActionInput
    ): Promise<SharepointFileTypes.SharepointCreateFolderActionOutput> {
        const sharepointParentFolder = input.parentFolder;
        const cloudPath = input.cloudPath;
        let sharepointParentFolderId = undefined;
        const token = await this.microsoftSession.getToken();
        if (cloudPath === CloudPath.SITE) {
            const sharepointSiteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
            const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);
        }
        if (sharepointParentFolder) {
            sharepointParentFolderId = await this.microsoftService.getFileIdByPath(token.token, cloudPath, sharepointParentFolder);
        }
        await this.microsoftService.createFolder(token.token, cloudPath, input.folderName, sharepointParentFolderId);

        return 'Folder created successfully';
    }

    run(request: SharepointFileTypes.FileActionRequest) {
        switch (request.script) {
            case 'sharepointFile.downloadFileFromRoot':
                return this.downloadFromRoot(request.input);
            case 'sharepointFile.downloadFileFromSite':
                return this.downloadFromSite(request.input);
            case 'sharepointFile.downloadFiles':
                return this.downloadFiles(request.input);
            case 'sharepointFile.uploadFile':
                return this.upload(request.input);
            case 'sharepointFile.createFolder':
                return this.createFolder(request.input);
            case 'sharepointFile.getSharepointSiteConnection':
                return this.getSharepointSiteConnection(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
