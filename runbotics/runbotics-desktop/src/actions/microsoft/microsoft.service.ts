import Axios, { Method, AxiosError, AxiosResponse } from 'axios';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

export class MicrosoftService {
    constructor() {}

    private readonly logger = new RunboticsLogger(MicrosoftService.name);
    private TOKEN: string = '';
    private sessionId: string = '';
    private sheet: string = '';
    private fileName: string = '';
    private fileId: string = '';
    private siteId: string = '';
    private driveId: string = '';
    private listId: string = '';
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

    async getDownloadFileLink(token: string, sharepointFileId: string) {
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

    async uploadFile(token: string, sharepointFileName: string, contentType, content, cloudPath) {
        this.TOKEN = token;
        let url = '';

        switch (cloudPath) {
            case 'root':
                url = `https://graph.microsoft.com/v1.0/me/drive/root:/${sharepointFileName}:/content`;
                break;
            case 'site':
                url = `https://graph.microsoft.com/v1.0//sites/${this.siteId}/drives/${this.driveId}/root:/${sharepointFileName}:/content`;
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
        this.fileName = sharepointFileName;
    }

    async getSiteId(token: string, siteName: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/sites?search='${siteName}'`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });
        const siteId = data.value.find((site) => site.displayName === siteName)?.id;
        // const sliceSiteId = siteId.slice(siteId.indexOf(',') + 1, siteId.lastIndexOf(','));
        this.siteId = siteId;
        return siteId;
    }

    async getSiteIdA41SP(token: string, sitePath: string) {
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

    async getDownloadFileLinkFromSite(folderPath: string, fileName: string) {
        let url;
        if (folderPath && folderPath.trim() !== '') {
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

    async getFileId(token: string, fileName: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/me/drive/search(q='${fileName}')?select=name,id,webUrl`;

        const authHeaders = this.getAuthHeader();
        const { data } = await MicrosoftService.makeRequest().get<APICell>(url, {
            headers: {
                ...authHeaders,
            },
        });

        const fileId = data.value.find((file) => file.name === fileName)?.id;

        if (!this.fileName.includes(fileName)) {
            this.fileId = fileId;
            this.fileName = fileName;
        }

        return this.fileId;
    }

    async getFileIdA41SP(token: string, filePath: string) {
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

        if (!this.fileName.includes(fileName)) {
            this.fileId = fileId;
            this.fileName = fileName;
        }

        return this.fileId;
    }

    async getWorksheetId(token: string, worksheetName: string) {
        this.TOKEN = token;
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets`;

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

    async createSession(token: string, persistChanges?: boolean) {
        this.TOKEN = token;
        this.logger.log(`Trying to create session for file: ${this.fileId} and sheet: ${this.sheet}`);
        const { data } = await MicrosoftService.makeRequest().post<{ id: string }>(
            `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/createSession`,
            {
                headers: this.getAuthHeader(),
                data: {
                    persistChanges: persistChanges != undefined ? persistChanges : false,
                },
            },
        );
        this.logger.log(`Session for file ${this.fileId} and sheet: ${this.sheet} created`);
        this.sessionId = data.id;

        return data.id;
    }

    async setCellValue(address: string, value: string) {
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${address}:${address}')`;

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
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${range}')`;

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

    async getCellValue(address: string, fileId?: string, sheet?: string) {
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${address}:${address}')`;

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
        this.logger.log(`READ: ${JSON.stringify(mapResponseToCell(data))} from sheet: ${sheet}`);
        return mapResponseToCell(data);
    }

    async getRange(address: string, fileId?: string, sheet?: string) {
        const addressArray = address.split(':');
        const url = `https://graph.microsoft.com/v1.0/me/drive/items/${this.fileId}/workbook/worksheets(%27%7B${this.sheet}%7D%27)/range(address='${addressArray[0]}:${addressArray[1]}')`;

        const mapResponseToRange = (data: APICell) => ({
            address,
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
        this.logger.log(`READ: ${JSON.stringify(mapResponseToRange(data))} from sheet: ${sheet}`);
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
