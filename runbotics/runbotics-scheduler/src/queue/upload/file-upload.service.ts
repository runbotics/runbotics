/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { Method, AxiosResponse } from 'axios';
import mime from 'mime-types';
import { APICell } from 'src/types/FileUpload';
import { Logger } from 'src/utils/logger';

export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);

    constructor() { }

    private token = '';

    private getAuthHeader() {
        return {
            Authorization: `Bearer ${this.token}`,
        };
    }

    private getFileInfo(base64File: string) {
        const contentType = base64File.split(';')[0].split(':')[1];
        return { contentType: contentType, extension: mime.extension(contentType) };
    }

    private bufferFromBase64(base64File: string) {
        if (base64File.includes('base64,')) {
            return Buffer.from(base64File.split(';base64,').pop(), 'base64');
        }
        return Buffer.from(base64File, 'base64');
    }

    static isObject(obj: unknown) {
        return !!obj && typeof obj === 'object' && !Array.isArray(obj);

    }

    public static flattenObject(object: Record<string, any>, parent?: string): any[] {
        const results = [];
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
        return FileUploadService.flattenObject(uiSchema)
            .map((item: string) => {
                return item.includes('FileDropzone') ? item.substring(0, item.indexOf('.ui:widget')) : null;
            })
            .filter((item) => item !== null);
    }

    static makeRequest() {
        async function performRequest<T>(url: string, method: Method, config): Promise<AxiosResponse<T>> {
            const request = await Axios({
                url,
                method,
                data: config.data,
                headers: {
                    ...config.headers,
                },
                cancelToken: config.cancelToken,
            });
            return request;
        }

        return {
            get: <T>(url, config = {}) => performRequest<T>(url, 'GET', config),
            post: <T>(url, config = {}) => performRequest<T>(url, 'POST', config),
            put: <T>(url, config = {}) => performRequest<T>(url, 'PUT', config),
            patch: <T>(url, config = {}) => performRequest<T>(url, 'PATCH', config),
            delete: <T>(url, config = {}) => performRequest<T>(url, 'DELETE', config),
            execute: <T>(method, url, config = {}) => performRequest<T>(url, method, config),
        };
    }

    async getDownloadFileLink(token: string, sharepointFileId: string) {
        this.token = token;
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${sharepointFileId}`;

        const authHeaders = this.getAuthHeader();
        const { data } = await FileUploadService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const downloadLink = data?.['@microsoft.graph.downloadUrl'];
        return downloadLink;
    }

    async uploadFile(token: string, sharepointFileName: string, content: string, orchestratorProcessInstanceId: string) {
        this.token = token;
        const spPath = `RunboticsTemp/${orchestratorProcessInstanceId}`;
        const fileInfo = this.getFileInfo(content);
        const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${spPath}/${sharepointFileName}.${fileInfo.extension}:/content`;

        const authHeaders = this.getAuthHeader();
        const { data } = await FileUploadService.makeRequest().put<any>(url, {
            headers: {
                ...authHeaders,
                'Content-Type': fileInfo.contentType,
            },
            data: this.bufferFromBase64(content),
        });

        this.logger.log('File uploaded successfully', data);
        return spPath + '/' + data.name;
    }

    async deleteTempFolder(token: string, orchestratorProcessInstanceId: string) {
        this.token = token;
        const spPath = `RunboticsTemp/${orchestratorProcessInstanceId}`;
        const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${spPath}`;

        const authHeaders = this.getAuthHeader();
        const { data } = await FileUploadService.makeRequest().delete<any>(url, {
            headers: {
                ...authHeaders,
            },
        });

        this.logger.log('Temp folder deleted successfully', data);
    }
}
