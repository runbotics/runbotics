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
        await this.microsoftService.getRootFileIdByPath(token.token, input.filePath);
        const downloadLink = await this.microsoftService.getDownloadFileLink(token.token);

        // const downloadFile = (uri, filename) => {
        //     return new Promise((resolve, reject) => {
        //         request.head(uri, function(err, res, body){
        //             request(uri).pipe(fs.createWriteStream(`${input.path}//${filename}`)).on('close', () => resolve(input.fileName));
        //         });
        //     })
        // };

        const temp = input.filePath.split('/');
        const fileName = temp[temp.length - 1];
        await this.downloadFile(downloadLink, path.join(input.localPath, fileName));
    
        return 'File downloaded successfully';
    }

    async downloadFromSite(
        input: SharepointDownloadFromSiteActionInput,
    ): Promise<SharepointDownloadActionOutput> {
        const token = await this.microsoftSession.getToken();
        const siteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        await this.microsoftService.getDriveId(token.token, siteId, input.listName);
        const downloadLink = await this.microsoftService.getDownloadFileLinkFromSite(token.token, input.fileName, input.folderPath);

        await this.downloadFile(downloadLink, path.join(input.localPath, input.fileName));
        
        return 'File downloaded successfully';
    }

    async upload(input: SharepointUploadActionInput): Promise<SharepointUploadActionOutput> {
        const filePath = input.filePath;
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
        ];
        const extension = path.extname(filePath);
        if (!extension) {
            throw new Error('filePath needs to specify extension, e.g. file.pptx');
        }
        const contentType = allContentTypes.find((t) => t.key === extension).value;
        const token = await this.microsoftSession.getToken();
        if (cloudPath === CloudPath.Site) {
            const siteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
            await this.microsoftService.getDriveId(token.token, siteId, input.listName);
        }

        await this.microsoftService.uploadFile(token.token, filePath, cloudPath, contentType, content);

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
        const siteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        await this.microsoftService.getListId(token.token, siteId, input.listName);
        await this.microsoftService.getDriveId(token.token, siteId, input.listName);

        const fileNames = await this.microsoftService.getItemListByField(input.fieldName, input.fieldValue);
        for (const fileName of fileNames) {
            const downloadLink = await this.microsoftService.getDownloadFileLinkFromSite(token.token, fileName);

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

            await this.downloadFile(downloadLink, path.join(input.storeDirectory, fileName));
            this.logger.log(`file ${fileName} downloaded`);
        }
        return fileNames;
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
