import { Injectable, Scope } from '@nestjs/common';
import { Logger } from '../utils/logger';
import Axios from 'axios';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { APIToken, AuthData } from 'src/types/FileUpload';


@Injectable()
export class MicrosoftSessionService {
    constructor(
        private serverConfigService: ServerConfigService,
    ) { }
    private readonly logger = new Logger(MicrosoftSessionService.name);
    private session: AuthData = {
        token: undefined,
        refreshToken: undefined,
        expires: undefined,
    };

    private readonly TENANT_ID = this.serverConfigService.sharepointTenantId;
    private readonly CLIENT_ID = this.serverConfigService.sharepointClientId;
    private readonly USERNAME = this.serverConfigService.sharepointUsername;
    private readonly PASSWORD = this.serverConfigService.sharepointPassword;
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
            return MicrosoftSessionService.authorize(this.TOKEN_URL, this.params);
        }
    }

    public static async authorize(url: string, params: { [key: string]: string }) {
        const CancelToken = Axios.CancelToken.source();
        const tokens = Axios
            .post<APIToken>(url, this.encodeParams(params), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                cancelToken: CancelToken.token,
            })
            .then(({ data }) => this.deserializeToken(data));
        return tokens;
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
