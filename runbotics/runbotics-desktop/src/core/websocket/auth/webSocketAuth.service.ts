import { AuthService } from '#core/auth/auth.service';
import getBotSystem from '#utils/botSystem';
import { Injectable } from '@nestjs/common';
import { ServerConfigService } from '../../../config/server-config.service';

export type WebSocketAuthData = {
    token: string
    installationId: string
    system: string
    collection: string
    version: string
}

@Injectable()
export class WebSocketAuthService {
    constructor(
        private readonly authService: AuthService,
        private readonly serverConfigService: ServerConfigService,
    ) { }

    async getWebSocketCredentials(): Promise<WebSocketAuthData> {
        const tokenData = await this.authService.getValidTokenData();

        return {
            token: tokenData.token,
            installationId: tokenData.installationId,
            system: getBotSystem(),
            collection: this.serverConfigService.collection,
            version: this.serverConfigService.version,
        };
    }
}
