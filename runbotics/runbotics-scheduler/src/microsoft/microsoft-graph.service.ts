import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { MicrosoftAuthService } from './microsoft-auth.service';
// required by microsoft-graph-client
import 'cross-fetch/polyfill';

@Injectable()
export class MicrosoftGraphService {
    private readonly client: Client;

    constructor(
        private readonly microsoftAuthService: MicrosoftAuthService,
    ) {
        this.client = Client.initWithMiddleware({
            authProvider: this.microsoftAuthService,
        });
    }

    api(path: string) {
        return this.client.api(path);
    }
}