import Axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import mimeTypes from 'mime-types';
import { v4 as uuid } from 'uuid';

import { StorageService } from '#config';
import { RunboticsLogger } from '#logger';

import { ApiDownloadFileOutput, ApiRequestActionRequest, ApiRequestInput, ApiRequestOutput } from '.';

@Injectable()
export default class ApiRequestActionHandler extends StatelessActionHandler {
    private logger = new RunboticsLogger(ApiRequestActionHandler.name);

    constructor(private storageService: StorageService) {
        super();
    }

    private request = async <T>(input: ApiRequestInput): Promise<ApiRequestOutput<T>> => {
        let response: AxiosResponse | undefined;
        let body: unknown | undefined;

        try {
            const method = input.method ?? 'GET';
            if (['PUT', 'POST', 'PATCH'].includes(method)) {
                body = typeof input.body === 'object' ? input.body : JSON.parse(input.body);
            }
            if (input.headers['Content-Type'] && input.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                const qs = await import('qs');
                body = qs.stringify(body);
            }
            switch (method) {
                case 'GET':
                    response = await Axios.get(input.url, { headers: input.headers });
                    break;
                case 'DELETE':
                    response = await Axios.delete(input.url, { headers: input.headers });
                    break;
                case 'PATCH':
                    response = await Axios.patch(input.url, body, { headers: input.headers });
                    break;
                case 'PUT':
                    response = await Axios.put(input.url, body, { headers: input.headers });
                    break;
                case 'POST':
                    response = await Axios.post(input.url, body, { headers: input.headers });
                    break;
                default:
                    response = await Axios.get(input.url, { headers: input.headers });
                    break;
            }
        } catch (e) {
            if (!Axios.isAxiosError(e)) {
                throw new Error(e);
            }

            this.logger.error(e);
            response = e.response;
            if (!response || response.status >= 400) {
                throw new Error(e.message);
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
        const extension = mimeTypes.extension(response.headers['content-type']);
        if (!extension) {
            throw new Error('Unable to determine the extension');
        }

        const fileName = `${process.cwd()}\\temp\\${uuid()}.${extension}`.replace(/\\\\/g, '\\');
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
