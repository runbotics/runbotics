import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';

import { Injectable } from '@nestjs/common';
import { MicrosoftSession } from '../microsoft/microsoft.session';
import { MicrosoftService, CloudPath } from '../microsoft/microsoft.service';
import path from 'path';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

import fs, { createWriteStream } from 'fs';
import { externalAxios } from '../../config/axios-configuration';

// ----
export type SharepointDownloadFromRootActionInput = {
    filePath: string;
    localPath: string;
};
export type SharepointDownloadFromSiteActionInput = {
    siteName: string;
    listName: string;
    folderPath: string;
    fileName: string;
    localPath: string;
};
export type SharepointDownloadActionOutput = any;

// ----
export type SharepointDownloadFilesInput = {
    siteName: string;
    listName: string;
    fieldName: string;
    fieldValue: string;
    storeDirectory: string;
};
export type SharepointDownloadFilesOutput = string[];

// ----
export type SharepointUploadActionInput = {
    siteName: string;
    listName: string;
    filePath: string;
    localPath: string;
    cloudPath: string;
};
export type SharepointUploadActionOutput = any;

// ----
export type SharepointCreateFolderActionInput = {
    siteName: string;
    listName: string;
    folderName: string;
    parentFolder: string;
    cloudPath: string;
}

export type SharepointCreateFolderActionOutput = any;

// ----
export type SharepointSiteConnectionActionInput = {
    siteName: string;
    listName: string;
};
export type SharepointSiteConnectionActionOutput = any;

export type FileActionRequest<I> = DesktopRunRequest<any> & {
    script:
    | 'sharepointFile.downloadFileFromRoot'
    | 'sharepointFile.downloadFileFromSite'
    | 'sharepointFile.uploadFile'
    | 'sharepointFile.createFolder'
    | 'sharepointFile.getSharepointSiteConnection'
    | 'sharepointFile.downloadFiles';
};

@Injectable()
export class SharepointFileActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(SharepointFileActionHandler.name);

    constructor(
        private readonly microsoftSession: MicrosoftSession,
        private readonly microsoftService: MicrosoftService,
    ) {
        super();
    }

    async downloadFromRoot(input: SharepointDownloadFromRootActionInput): Promise<SharepointDownloadActionOutput> {
        const token = await this.microsoftSession.getToken();
        const sharepointFileId = await this.microsoftService.getFileIdByPath(token.token, CloudPath.ROOT, input.filePath);
        const sharepointDownloadLink = await this.microsoftService.getDownloadFileLink(token.token);

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
        input: SharepointDownloadFromSiteActionInput,
    ): Promise<SharepointDownloadActionOutput> {
        const token = await this.microsoftSession.getToken();
        const sharepointSiteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);
        const sharepointDownloadLink = await this.microsoftService.getDownloadFileLinkFromSite(token.token, input.fileName, input.folderPath);
        const pathToSave = input.localPath ?? path.join('./', 'temp');

        await this.downloadFile(sharepointDownloadLink, path.join(pathToSave, input.fileName));

        return path.join(pathToSave, input.fileName);
    }

    async upload(input: SharepointUploadActionInput): Promise<SharepointUploadActionOutput> {
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
        input: SharepointSiteConnectionActionInput,
    ): Promise<SharepointSiteConnectionActionOutput> {
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

    async downloadFiles(input: SharepointDownloadFilesInput): Promise<SharepointDownloadFilesOutput> {
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

    async createFolder(input: SharepointCreateFolderActionInput): Promise<SharepointCreateFolderActionOutput> {
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

    async run(request: FileActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'sharepointFile.downloadFileFromRoot':
                output = await this.downloadFromRoot(request.input);
                break;
            case 'sharepointFile.downloadFileFromSite':
                output = await this.downloadFromSite(request.input);
                break;
            case 'sharepointFile.downloadFiles':
                output = await this.downloadFiles(request.input);
                break;
            case 'sharepointFile.uploadFile':
                output = await this.upload(request.input);
                break;
            case 'sharepointFile.createFolder':
                output = await this.createFolder(request.input);
                break;
            case 'sharepointFile.getSharepointSiteConnection':
                output = await this.getSharepointSiteConnection(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
