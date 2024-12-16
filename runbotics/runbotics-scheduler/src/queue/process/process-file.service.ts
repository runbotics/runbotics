import mime from 'mime-types';
import { OneDriveService } from '#/microsoft/one-drive';
import { Logger } from '#/utils/logger';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessFileService {
    private readonly logger = new Logger(ProcessFileService.name);

    constructor(
        private readonly oneDriveService: OneDriveService,
    ) {}

    getFileSchemaKeys(uiSchema: Record<string, any>) {
        return this.flattenObject(uiSchema)
            .reduce<string[]>((acc, item) => {
                if (item.includes('FileDropzone'))
                    acc.push(item.substring(0, item.indexOf('.ui:widget')));
                return acc;
            }, []);
    }

    async uploadFile(content: string, orchestratorProcessInstanceId: string) {
        const fileInfo = this.getFileInfo(content);
        const filePath = `${orchestratorProcessInstanceId}/${fileInfo.fileName}.${fileInfo.extension}`;

        const data = await this.oneDriveService.uploadToWorkingDirectory(filePath, content, fileInfo.contentType);
        const absoluteFilePath = `${data.parentReference.path.split(':')[1].slice(1)}/${fileInfo.fileName}.${fileInfo.extension}`;
        return absoluteFilePath;
    }

    async deleteTempFiles(orchestratorProcessInstanceId: string) {
        await this.oneDriveService.deleteItemFromWorkingDirectory(orchestratorProcessInstanceId)
            .then(() => {
                this.logger.log('Temporary process files deleted');
            })
            .catch((e) => {
                this.logger.error('Failed to delete process temporary OneDrive files -', e.message);
            });
    }

    private getFileInfo(base64File: string) {
        const filenamePrefix = /^filename:(.*);data:(.*);base64,(.*)$/;
        const standardPrefix = /^data:(.*);base64,(.*)$/;

        const prefix = base64File.split(';');

        const isFilenamePrefix = filenamePrefix.test(base64File);
        const isStandardPrefix = standardPrefix.test(base64File);

        if (!isFilenamePrefix && !isStandardPrefix) {
            throw new Error('Expected following file format: filename:<name>data:<content-type>;base64,base64string or data:<content-type>;base64,base64string');
        }

        const fileName = isFilenamePrefix
            ? prefix[0].split(':')[1]
            : randomUUID();

        const contentType = isFilenamePrefix
            ? prefix[1].split(':')[1]
            : prefix[0].split(':')[1];

        const extension = mime.extension(contentType);
        if (!extension) {
            throw new Error('Unable to determine the extension');
        }

        return {
            fileName,
            extension,
            contentType,
        };
    }

    private isObject(obj: unknown): obj is object {
        return !!obj && typeof obj === 'object' && !Array.isArray(obj);
    }

    private flattenObject(object: Record<string, any>, parentKey?: string) {
        const results: string[] = [];

        for (const [ key, value ] of Object.entries(object)) {
            const compoundKey = parentKey ? `${parentKey}.${key}` : `${key}`;

            if (this.isObject(value))
                results.push(...this.flattenObject(value, compoundKey));
            else
                results.push(`${compoundKey}=${value}`);
        }

        return results;
    }
}
