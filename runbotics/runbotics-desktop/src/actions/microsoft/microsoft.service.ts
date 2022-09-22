import Axios, { Method, AxiosError, AxiosResponse } from 'axios';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

export class MicrosoftService {
    constructor() {}

    private readonly logger = new RunboticsLogger(MicrosoftService.name);
    private TOKEN: string = '';
    private fileName: string = '';
    private fileId: string = '';
    private siteId: string = '';
    private driveId: string = '';
    private listId: string = '';
    private sessionId: string = '';
    private sheet: string = '';
    private cloudPath: string = '';
    private getAuthHeader() {
        return {
            Authorization: `Bearer ${this.TOKEN}`,
        };
    }

    private getSessionHeader() {
        return {
            'workbook-session-id': this.sessionId,
        };
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
            } catch(error) {
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

    async getDownloadFileLink(token: string, fileId?: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const downloadLink = data?.['@microsoft.graph.downloadUrl'];
        return downloadLink;
    }

    async getDownloadFileLinkFromSite(token: string, fileName: string, folderPath?: string, ) {
        this.TOKEN = token;
        let url;
        if (folderPath) {
            url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/root:/${folderPath}:/children`;
        } else {
            url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/root/children`;
        }

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const downloadLink = data.value.find((item) => item.name === fileName)?.['@microsoft.graph.downloadUrl'];
        return downloadLink;
    }

    async uploadFile(token: string, filePath: string, cloudPath: string, contentType: string, content) {
        this.TOKEN = token;
        let url = '';

        switch (cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/root:/${filePath}:/content`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0//sites/${this.siteId}/drives/${this.driveId}/root:/${filePath}:/content`;
                break;
        }

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().put<any>(url, {
            headers: {
                ...authHeaders,
                'Content-Type': contentType,
            },
            data: content,
        });

        this.fileId = data.id;
        this.fileName = filePath;
        this.cloudPath = cloudPath;
    }

    async getItemListByField(fieldName: string, fieldValue: any) {
        const url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/lists/${this.listId}/items?expand=fields`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const nameList = data.value
            .filter((site) => site.fields[`${fieldName}`] === fieldValue)
            ?.map((file) => file.fields.LinkFilename);
        return nameList;
    }

    async getSiteIdBySearch(token: string, siteName: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/sites?search='${siteName}'`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const siteId = data.value.find((site) => site.displayName === siteName)?.id;
        this.siteId = siteId;
        return siteId;
    }

    async getSiteIdByPath(token: string, sitePath: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/sites/all41sonline.sharepoint.com:/${sitePath}:`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<SingleResponse>(url, {
            headers: {
                ...authHeaders,
            },
        });
        this.siteId = data.id;
        return data.id;
    }

    async getListId(token: string, siteId: string, listName: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const listId = data.value.find((site) => site.displayName === listName)?.id;
        this.listId = listId;
        return listId;
    }

    async getDriveId(token: string, siteId: string, driveName: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const driveId = data.value.find((site) => site.name === driveName)?.id;
        this.driveId = driveId;
        return driveId;
    }

    async getFileIdBySearch(token: string, cloudPath: string, fileName: string) {
        this.TOKEN = token;
        let url = '';

        switch (cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/search(q='${fileName}')?select=name,id,webUrl`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/search(q='${fileName}')?select=name,id,webUrl`;
                break;
        }

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const fileId = data.value.find((file) => file.name === fileName)?.id;
        if (!this.fileName.includes(fileName) || cloudPath !== this.cloudPath) {
            this.fileId = fileId;
            this.fileName = fileName;
            this.cloudPath = cloudPath;
        }
        return this.fileId;
    }

    async getRootFileIdByPath(token: string, filePath: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${filePath}:/?select=name,id,webUrl`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<SingleResponse>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const fileName = data.name;
        const fileId = data.id;
        if (!this.fileName.includes(fileName) || this.cloudPath !== CloudPath.Root) {
            this.fileId = fileId;
            this.fileName = fileName;
            this.cloudPath = CloudPath.Root;
        }
        return this.fileId;
    }
    
    async getWorksheetId(token: string, cloudPath: string, worksheetName: string) {
        this.TOKEN = token;
        let url = '';

        switch (cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets`;
                break;
        }

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const worksheetId = data.value.find((worksheet) => worksheet.name === worksheetName)?.id;
        const sheetId = worksheetId?.slice(1, -1);
        this.sheet = sheetId;
    }

    async createSession(token: string, cloudPath: string, persistChanges?: boolean) {
        this.TOKEN = token;
        let url = '';
        this.logger.log(`Trying to create session for file: ${this.fileId} and sheet: ${this.sheet}`);

        switch (cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/createSession`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/createSession`;
                break;
        }

        const { data } = await MicrosoftService.makeRequest().post<{ id: string }>(
            url,
            {
                headers: this.getAuthHeader(),
                data: {
                    persistChanges: persistChanges != undefined ? persistChanges : false,
                },
            },
        );
        this.logger.log(`Session for file ${this.fileId} and sheet: ${this.sheet} created`);
        this.cloudPath = cloudPath;
        this.sessionId = data.id;
        return data.id;
    }

    async setCellValue(address: string, value: string) {
        let url = '';

        switch (this.cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${address}:${address}')`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${address}:${address}')`;
                break;
        }

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().patch(url, {
            headers: {
                ...authHeaders,
            },
            data: {
                values: [[value]],
            },
        });
        this.logger.log(`SET: ${address} value: ${value} on sheet: ${this.sheet}`);
        return `SET: ${address} value: ${value} on sheet: ${this.sheet}`;
    }

    async updateRange(range: string, values: any[][]) {
        let url = '';

        switch (this.cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${range}')`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${range}')`;
                break;
        }

        const authHeaders = this.getAuthHeader();
        const response = await MicrosoftService.makeRequest().patch(url, {
            headers: {
                ...authHeaders,
            },
            data: {
                values: values,
            },
        });

        this.logger.log(`updateRanges: ${range} value: ${values} on sheet: ${this.sheet}`);
        return `updateRange: ${range} value: ${values} on sheet: ${this.sheet}`;
    }

    async getCellValue(address: string) {
        let url = '';

        switch (this.cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${address}:${address}')`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${address}:${address}')`;
                break;
        }
        const mapResponseToCell = (data: APICell) => ({
            address,
            value: data.values[0][0],
        });

        const sessionHeaders = this.getSessionHeader();
        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
                ...sessionHeaders,
            },
        });
        this.logger.log(`READ: ${JSON.stringify(mapResponseToCell(data))} from sheet: ${this.sheet}`);
        return mapResponseToCell(data);
    }

    async getRange(range: string) {
        let url = '';

        switch (this.cloudPath) {
            case CloudPath.Root:
                url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${range}')`;
                break;
            case CloudPath.Site:
                url = `https://graph.microsoft.com/v1.0/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${range}')`;
                break;
        }
        const mapResponseToRange = (data: APICell) => ({
            range,
            values: data.values,
        });

        const sessionHeaders = this.getSessionHeader();
        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
                ...sessionHeaders,
            },
        });
        this.logger.log(`READ: ${JSON.stringify(mapResponseToRange(data))} from sheet: ${this.sheet}`);
        return mapResponseToRange(data);
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

export enum CloudPath {
    Root = "root",
    Site = "site",
}
