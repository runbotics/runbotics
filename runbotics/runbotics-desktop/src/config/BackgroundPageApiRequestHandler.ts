import Axios from 'axios';
import fs from 'fs';
import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common';
import mimeTypes from 'mime-types';
import { ApiResource } from './ApiResource';
import { orchestratorAxios } from './axios-configuration';
import { StorageService } from './StorageService';
import { RunboticsLogger } from '../logger/RunboticsLogger';
import { DesktopRunRequest, DesktopRunResponse, StatelessActionHandler } from 'runbotics-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BackgroundPageApiRequestHandler extends StatelessActionHandler implements OnApplicationBootstrap {
    private logger = new RunboticsLogger(BackgroundPageApiRequestHandler.name);

    constructor(private storageService: StorageService) {
        super();
    }

    async onApplicationBootstrap() {
        await this.asyncInit();
    }

    public asyncInit = async () => {
        const setupAxiosInterceptors = (onUnauthenticated: any) => {
            const onRequestSuccess = async (config: any) => {
                const token = await this.storageService.getItem('token');
                if (!config.headers.Authorization && token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            };
            const onResponseSuccess = (response: any) => response;
            const onResponseError = (err: any) => {
                const status = err.status || (err.response ? err.response.status : 0);
                if (status === 403 || status === 401) {
                    onUnauthenticated();
                }
                return Promise.reject(err);
            };
            orchestratorAxios.interceptors.request.use(onRequestSuccess);
            orchestratorAxios.interceptors.response.use(onResponseSuccess, onResponseError);
        };

        await setupAxiosInterceptors(() => {
            this.logger.error('Unauthenticated', 'BackgroundPageApiRequestHandler');
        });
        return;
    };

    private request = async <T>(input: ApiRequestInput): Promise<ApiRequestOutput<T>> => {
        let compiled = input.url;
        for (let prop in input.templateData) {
            if (input.templateData.hasOwnProperty(prop)) {
                compiled = compiled.replace(new RegExp('\\${' + prop + '}', 'g'), input.templateData[prop]);
            }
        }
        let response;
        const method = input.method ? input.method : 'GET';
        try {
            switch (method) {
                case 'GET':
                    response = await Axios.get(compiled, { headers: input.headers });
                    break;
                case 'DELETE':
                    response = await Axios.delete(compiled, { headers: input.headers });
                    break;
                case 'PATCH':
                    response = await Axios.patch(compiled, JSON.parse(input.body), { headers: input.headers });
                    break;
                case 'PUT':
                    response = await Axios.put(compiled, JSON.parse(input.body), { headers: input.headers });
                    break;
                case 'POST':
                    response = await Axios.post(compiled, JSON.parse(input.body), { headers: input.headers });
                    break;
                default:
                    response = await Axios.get(compiled, { headers: input.headers });
                    break;
            }
        } catch (e) {
            this.logger.log(e); 
            response = e.response;
            if(!response || response.status > 400){
                throw new InternalServerErrorException(e);
            }
        }
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    };

    private download = async (input: ApiRequestInput): Promise<ApiDownloadFileOutput> => {
        const url = input.url;
        let fileName: string;
        try {
            const response = await Axios.get(url, {
                responseType: 'stream'
            });
            const mimeType = mimeTypes.extension(response.headers['content-type']);
            fileName = `${process.cwd()}\\temp\\${uuid()}.${mimeType}`.replace(/\\\\/g, '\\');
            await new Promise((resolve, reject) =>
                response.data.pipe(fs.createWriteStream(fileName)
                    .on('finish', () => resolve(true)))
                    .on('error', (e) => reject(e))
            );
        } catch (e) {
            throw e;
        }

        return fileName;
    }
    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'api.request':
                output = await this.request(request.input);
                break;
            case 'api.downloadFile':
                output = await this.download(request.input);
        }

        return {
            status: 'ok',
            output: output,
        };
    }
}

export type ApiRequestInput = ApiResource & {
    templateData?: Record<string, any>;
};

export type ApiRequestOutput<T> = {
    data: T;
    status: number;
    statusText: string;
};

export type ApiDownloadFileOutput = string;

export type ApiDownloadFileInput = {
    url: string;
}