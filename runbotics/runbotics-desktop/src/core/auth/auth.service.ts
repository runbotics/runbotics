import { ServerConfigService, StorageService } from '#config';
import { RunboticsLogger } from '#logger';
import getBotSystem from '#utils/botSystem';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import Axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { TokenData } from './auth.types';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
    private readonly logger = new RunboticsLogger(AuthService.name);
    private reauthenticateIntervalHandle: ReturnType<typeof setInterval> | null = null;
    private readonly authOrchestratorAxios = Axios.create({ maxRedirects: 0 });
    private tokenData: TokenData | null = null;

    constructor(
        private readonly serverConfigService: ServerConfigService,
        private readonly storageService: StorageService,
    ) { 
        this.authOrchestratorAxios.defaults.baseURL = this.serverConfigService.entrypointUrl;
    }

    onApplicationBootstrap() {
        this.setupTokenRefreshingTask();
    }

    setupTokenRefreshingTask() {
        const refreshEvery = this.serverConfigService.authTokenRefreshSeconds;
        this.logger.log(`Setting up token refresh every ${refreshEvery}s`);
        this.clearTokenRefreshingTask();

        this.reauthenticateIntervalHandle = setInterval(async () => {
            try {
                await this.authenticate();
            } catch (e) {
                this.logger.error('Periodic credential refreshing failed', e);
            }
        }, refreshEvery * 1000);
    }

    clearTokenRefreshingTask() {
        if (this.reauthenticateIntervalHandle !== null) {
            clearInterval(this.reauthenticateIntervalHandle);
            this.reauthenticateIntervalHandle = null;
        }
    }

    async getValidTokenData(): Promise<TokenData> {
        const now = Date.now() / 1000;
        const leeway = this.serverConfigService.autoTokenRefreshLeewaySeconds;

        if (!this.tokenData || (leeway >= 0 && now + leeway > this.tokenData.expiresAt)) await this.authenticate();

        const token = this.tokenData;
        if (!token) throw new Error('Authenticate filed to set token');

        return { ...token };
    }

    private async authenticate(): Promise<TokenData> {
        this.logger.log('=> Authenticating with server: ' + this.serverConfigService.entrypointUrl);

        const response = await this.authOrchestratorAxios.post(
            '/api/authenticate',
            {
                username: this.serverConfigService.credentials.username,
                password: this.serverConfigService.credentials.password,
                rememberMe: true,
            },
            {
                maxRedirects: 0,
            },
        )
            .catch((error) => {
                this.logger.error('<= Error authenticating with server: ' + this.serverConfigService.entrypointUrl, error);
                throw error;
            });

        const token: string = response.data['id_token'];

        const decodedToken = jwtDecode(token);
        const authUser = await this.authOrchestratorAxios.get<{ tenant: { id: string } }>('/api/account', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.data)
            .catch((error) => {
                this.logger.error('<= Error getting user from server: ' + this.serverConfigService.entrypointSchedulerUrl, error);
                throw error;
            });

        this.storageService.setValue('token', token);
        this.storageService.setValue('tenantId', authUser.tenant.id);

        const installationId = await this.getInstallationId();

        this.logger.log('<= Authenticated with server: ' + this.serverConfigService.entrypointUrl);

        this.logger.log('Installation ID: ' + installationId);

        const version = this.serverConfigService.version;
        this.logger.log('Version: ' + version);

        const system = getBotSystem();
        this.logger.log('System: ' + system);

        const collection = this.serverConfigService.collection;
        this.logger.log('Collection: ' + collection);

        const tokenData: TokenData = {
            expiresAt: decodedToken.exp ?? 0,
            token: token,
            tenantId: authUser.tenant.id,
            installationId: installationId,
        };

        this.tokenData = tokenData;
        return tokenData;
    }

    private async getInstallationId() {
        const response = this.storageService.getValue('installationId');
        let installationId: string;
        if (response && response['installationId']) {
            installationId = response['installationId'];
        } else if (this.serverConfigService.installationId) {
            installationId = this.serverConfigService.installationId;
        } else {
            installationId = uuidv4();
            this.storageService.setValue('installationId', installationId);
        }
        return installationId;
    }
}
