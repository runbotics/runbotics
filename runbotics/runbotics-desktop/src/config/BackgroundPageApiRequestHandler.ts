import Axios from 'axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ApiResource } from './ApiResource';
import { orchestratorAxios } from './axios-configuration';
import { StorageService } from './StorageService';
import { RunboticsLogger } from '../logger/RunboticsLogger';
import { DesktopRunRequest, DesktopRunResponse, StatelessActionHandler } from 'runbotics-sdk';

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
        const method = input.method ? input.method : 'get';
        try {
            switch (method) {
                case 'get':
                    response = await Axios.get(compiled, { headers: input.headers });
                    break;
                case 'post':
                    response = await Axios.post(compiled, JSON.parse(input.body), { headers: input.headers });
                    break;
                default:
                    response = await Axios.get(compiled, { headers: input.headers });
                    break;
            }
        } catch (e) {
            throw e;
        }
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    };

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'api.request':
                output = await this.request(request.input);
                break;
        }

        return {
            status: 'ok',
            output: output,
        };
    }

    // public apiRequest = async (data: ScriptData<ApiRequestInput>, executionContext: Readonly<IExecutionContext>): Promise<ApiRequestOutput<any>> => {
    //     const apiRequestScriptData: ApiRequestScriptData = data as ApiRequestScriptData
    //     const response = await this.request(apiRequestScriptData.input)
    //     return response
    // }
}

export type ApiRequestInput = ApiResource & {
    templateData?: Record<string, any>;
};

export type ApiRequestOutput<T> = {
    data: T;
    status: number;
    statusText: string;
};
