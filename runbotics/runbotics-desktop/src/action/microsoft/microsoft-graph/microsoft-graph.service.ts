import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
// required by microsoft-graph-client
import 'cross-fetch/polyfill';

import { MicrosoftAuthService } from '../microsoft-auth.service';
import { RequestOptions } from './microsoft-graph.types';

const errorMessage = 'Incorrect or missing Microsoft credentials';

export class MicrosoftGraphService {
    private readonly client: Client;

    constructor(
        private readonly microsoftAuthService: MicrosoftAuthService,
    ) {
        this.client = Client.initWithMiddleware({
            authProvider: this.microsoftAuthService,
        });
    }

    post<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
        if (!this.microsoftAuthService.hasCredentials())
            return Promise.reject(new Error(errorMessage));

        return this.api(path, options)
            .post(body);
    }

    get<T>(path: string, options?: RequestOptions): Promise<T> {
        if (!this.microsoftAuthService.hasCredentials())
            return Promise.reject(new Error(errorMessage));

        return this.api(path, options)
            .get();
    }

    patch<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
        if (!this.microsoftAuthService.hasCredentials())
            return Promise.reject(new Error(errorMessage));

        return this.api(path, options)
            .patch(body);
    }

    put<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
        if (!this.microsoftAuthService.hasCredentials())
            return Promise.reject(new Error(errorMessage));

        return this.api(path, options)
            .put(body);
    }

    delete(path: string, options?: RequestOptions): Promise<void> {
        if (!this.microsoftAuthService.hasCredentials())
            return Promise.reject(new Error(errorMessage));

        return this.api(path, options)
            .delete();
    }

    private api(path: string, options?: RequestOptions) {
        const request = this.client.api(path);

        if (options?.expand)
            request.expand(options.expand);
        if (options?.filter)
            request.filter(options.filter);
        if (options?.headers)
            request.headers(options.headers);
        if (options?.options)
            request.options(options.options);
        if (options?.orderBy)
            request.orderby(options.orderBy);
        if (options?.query)
            request.query(options.query);
        if (options?.responseType)
            request.responseType(options.responseType);
        if (options?.search)
            request.search(options.search);
        if (options?.select)
            request.select(options.select);
        if (options?.top)
            request.top(options.top);
        if (options?.count)
            request.count(options.count);
        if (options?.skip)
            request.skip(options.skip);

        return request;
    }
}
