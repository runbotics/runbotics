import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '../../../logger/RunboticsLogger';
import { ServerConfigService } from '../../../config/server-config.service';
import { StorageService } from '../../../config/storage.service';
import { orchestratorAxios, schedulerAxios } from '../../../config/axios-configuration';
import { v4 as uuidv4 } from 'uuid';
import getBotSystem from '#utils/botSystem';

@Injectable()
export class AuthService {
    private readonly logger = new RunboticsLogger(AuthService.name);

    constructor(
        private serverConfigService: ServerConfigService,
        private storageService: StorageService,
    ) { }

    async getCredentials() {
        this.logger.log('=> Authenticating with server: ' + this.serverConfigService.entrypointUrl);
        orchestratorAxios.defaults.baseURL = this.serverConfigService.entrypointUrl;
        schedulerAxios.defaults.baseURL = this.serverConfigService.entrypointSchedulerUrl;
        const response = await orchestratorAxios.post(
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

        const token = response.data['id_token'];
        orchestratorAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
        schedulerAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
        this.storageService.setValue('token', token);

        const authUser = (await orchestratorAxios.get('/api/account')).data;
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

        return {
            token,
            installationId,
            system,
            collection,
            version,
        };
    }

    async getInstallationId() {
        const response = this.storageService.getValue('installationId');
        let installationId;
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
