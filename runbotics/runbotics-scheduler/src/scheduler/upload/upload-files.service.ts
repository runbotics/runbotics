import Axios, { Method, AxiosResponse } from 'axios';
import mime from "mime-types"
import { Logger } from '../../utils/logger';

export class UploadFilesService {
    constructor() { }

    private readonly logger = new Logger(UploadFilesService.name);
    private TOKEN: string = '';
    private fileName: string = '';
    private fileId: string = '';
    private siteId: string = '';
    private driveId: string = '';

    private getAuthHeader() {
        return {
            Authorization: `Bearer ${this.TOKEN}`,
        };
    }

    private getFileInfo(base64File: string) {
        const contentType = base64File.split(';')[0].split(':')[1];
        return { contentType: contentType, extension: mime.extension(contentType) };
    }

    private bufferFromBase64(base64File: string) {
        return Buffer.from(base64File.split(';base64,').pop(), 'base64')
    };

    static isObject(obj: unknown) {
        return !!obj && typeof obj === "object" && !Array.isArray(obj);

    }

    public static flattenObject(object: Record<string, any>, parent?: string) {
        let results = [];
        for (let key in object) {
            const value = object[key];
            const thisKey = parent ? `${parent}.${key}` : `${key}`;

            results = results.concat(
                this.isObject(value) ? this.flattenObject(value, thisKey) : `${thisKey}=${value}`
            );
        }

        return results;
    }

    getFileKeysFromSchema(uiSchema: Record<string, any>) {
        return UploadFilesService.flattenObject(uiSchema)
            .map((item: string) => {
                return item.includes("FileDropzone") ? item.substring(0, item.indexOf(".ui:widget")) : null;
            })
            .filter((item) => item !== null);
    }
    static makeRequest() {
        async function performRequest<T>(url: string, method: Method, config): Promise<AxiosResponse<T>> {
            try {
                const request = await Axios({
                    url,
                    method,
                    data: config.data,
                    headers: {
                        ...config.headers,
                    },
                    cancelToken: config.cancelToken,
                });
                return request
            } catch (error) {
                throw error;
            }
        };

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
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}`;

        const authHeaders = this.getAuthHeader();
        const { data } = await UploadFilesService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const downloadLink = data?.['@microsoft.graph.downloadUrl'];
        return downloadLink;
    }

    async uploadFile(token: string, sharepointFileName: string, content) {
        this.TOKEN = token;
        const fileInfo = this.getFileInfo(content);
        let url = `https://graph.microsoft.com/v1.0/me/drive/root:/${sharepointFileName}.${fileInfo.extension}:/content`;

        const authHeaders = this.getAuthHeader();
        const { data } = await UploadFilesService.makeRequest().put<any>(url, {
            headers: {
                ...authHeaders,
                'Content-Type': fileInfo.contentType,
            },
            data: this.bufferFromBase64(content),
        });

        this.fileId = data.id;
        this.fileName = sharepointFileName + fileInfo.extension;
        //return download link
        return this.getDownloadFileLink(token, this.fileId);
    }
}

interface APICell {
    value?: any;
    values: string[][];
}

interface SingleResponse {
    id: string;
    name: string;
    webUrl: string;
}
