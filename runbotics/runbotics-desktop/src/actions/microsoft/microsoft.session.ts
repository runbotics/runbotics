import { Injectable, Logger, Scope } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';

import Axios from 'axios';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

export interface AuthData {
    token?: string;
    refreshToken?: string;
    expires?: number;
}

interface APIToken {
    access_token: string;
    refresh_token: string;
    expires_on: number;
}

@Injectable()
export class MicrosoftSession {
    constructor() { }
    private readonly logger = new RunboticsLogger(MicrosoftSession.name);
    private session: AuthData = {
        token: undefined,
        refreshToken: undefined,
        expires: undefined,
    };

    private readonly TENANT_ID = process.env.SHAREPOINT_TENANT_ID;
    private readonly CLIENT_ID = process.env.SHAREPOINT_CLIENT_ID;
    private readonly USERNAME = process.env.SHAREPOINT_USERNAME;
    private readonly PASSWORD = process.env.SHAREPOINT_PASSWORD;
    private readonly RESOURCE = 'https://graph.microsoft.com';
    private readonly CALLBACK_URL = 'http://localhost:3000';
    private readonly GRANT_TYPE = 'password';
    private readonly TOKEN_URL = `https://login.microsoftonline.com/${this.TENANT_ID}/oauth2/token`;

    private readonly params = {
        client_id: this.CLIENT_ID,
        grant_type: this.GRANT_TYPE,
        resource: this.RESOURCE,
        username: this.USERNAME,
        password: this.PASSWORD,
        callbackURL: this.CALLBACK_URL,
    };

    public async getToken() {
        if (this.session.token) {
            this.logger.log(`Using existing token...`);
            return this.session;
        } else {
            this.logger.log(`Getting new token...`);
            //const tokens = await MicrosoftSession.authorize(this.TOKEN_URL, this.params);
            //this.session.token = tokens.token;
            return MicrosoftSession.authorize(this.TOKEN_URL, this.params);
        }
    }

    public static async authorize(url: string, params: { [key: string]: string }) {
        const cancelToken = Axios.CancelToken.source();
        const token = await MicrosoftService.makeRequest()
            .post<APIToken>(url, {
                data: this.encodeParams(params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                cancelToken: cancelToken.token,
            })
            .then(({ data }) => this.deserializeToken(data));
        return token;
    }

    private static encodeParams(params: { [key: string]: string }) {
        return Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    private static deserializeToken(tokens: APIToken): AuthData {
        return {
            token: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expires: tokens.expires_on,
        };
    }
}
