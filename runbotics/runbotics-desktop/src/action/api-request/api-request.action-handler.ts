import Axios from 'axios';
import fs from 'fs';
import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common';
import { StatelessActionHandler } from 'runbotics-sdk';
import mimeTypes from 'mime-types';
import { v4 as uuid } from 'uuid';

import { StorageService, orchestratorAxios } from '#config';
import { RunboticsLogger } from '#logger';

import { ApiDownloadFileOutput, ApiRequestActionRequest, ApiRequestInput, ApiRequestOutput } from '.';

@Injectable()
export default class ApiRequestActionHandler extends StatelessActionHandler implements OnApplicationBootstrap {
    private logger = new RunboticsLogger(ApiRequestActionHandler.name);

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
        for (const prop in input.templateData) {
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
            if (!response || response.status > 400) {
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
        const response = await Axios.get(url, {
            responseType: 'stream',
        });
        const mimeType = mimeTypes.extension(response.headers['content-type']);
        const fileName = `${process.cwd()}\\temp\\${uuid()}.${mimeType}`.replace(/\\\\/g, '\\');
        await new Promise((resolve, reject) =>
            response.data
                .pipe(fs.createWriteStream(fileName).on('finish', () => resolve(true)))
                .on('error', (e) => reject(e)),
        );

        return fileName;
    };

    run(request: ApiRequestActionRequest) {
        switch (request.script) {
            case 'api.request':
                return this.request(request.input);
            case 'api.downloadFile':
                return this.download(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
