/* eslint-disable @typescript-eslint/no-explicit-any */
import mime from 'mime-types';
import { OneDriveService } from 'src/microsoft/one-drive.service';
import { Logger } from 'src/utils/logger';
// min nodejs v14.17
import { randomUUID } from 'crypto';

export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);

    constructor(
        private readonly oneDriveService: OneDriveService,
    ) { }

    private getFileInfo(base64File: string) {
        const filenamePrefix = /^filename:(.*);data:(.*);base64,(.*)$/;
        const standardPrefix = /^data:(.*);base64,(.*)$/;

        const prefix = base64File.split(';');

        if (filenamePrefix.test(base64File)) {
            const fileName = prefix[0].split(':')[1];
            const contentType = prefix[1].split(':')[1];
            return {
                fileName,
                extension: mime.extension(contentType),
                contentType
            };
        }

        if (standardPrefix.test(base64File)) {
            const contentType = prefix[0].split(':')[1];
            const fileName = randomUUID();
            return { contentType, extension: mime.extension(contentType), fileName };
        }

        throw new Error('Expected following file format: filename:<name>data:<content-type>;base64,base64string or data:<content-type>;base64,base64string');
    }

    private isObject(obj: unknown): obj is object {
        return !!obj && typeof obj === 'object' && !Array.isArray(obj);
    }

    private flattenObject(object: Record<string, any>, parent?: string) {
        const results: string[] = [];
        for (const key in object) {
            const value = object[key];
            const thisKey = parent ? `${parent}.${key}` : `${key}`;
            if (this.isObject(value)) {
                results.push(...this.flattenObject(value, thisKey));
            } else {
                results.push(`${thisKey}=${value}`);
            }

        }

        return results;
    }

    getFileKeysFromSchema(uiSchema: Record<string, any>) {
        return this.flattenObject(uiSchema)
            .map(item => item.includes('FileDropzone')
                ? item.substring(0, item.indexOf('.ui:widget'))
                : null)
            .filter((item) => item !== null);
    }

    // TODO
    async getDownloadFileLink(fileId: string) {
        const data = await this.oneDriveService.getItem(fileId);
        const downloadLink = data?.['@microsoft.graph.downloadUrl'];
        return downloadLink;
    }

    // TODO https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=http
    async uploadFile(content: string, orchestratorProcessInstanceId: string) {
        const fileInfo = this.getFileInfo(content);
        const fullFilePath = `RunboticsTemp/${orchestratorProcessInstanceId}/${fileInfo.fileName}.${fileInfo.extension}`;

        const data = await this.oneDriveService.uploadFile(fullFilePath, content, fileInfo.contentType);
        this.logger.log('File uploaded successfully', data);
        // TODO
        // return spPath + '/' + data.name;
        return '';
    }

    async deleteTempFolder(orchestratorProcessInstanceId: string) {
        const path = `RunboticsTemp/${orchestratorProcessInstanceId}`;

        const data = await this.oneDriveService.deleteItemByPath(path);

        this.logger.log('Temp folder deleted successfully', data);
    }
}
