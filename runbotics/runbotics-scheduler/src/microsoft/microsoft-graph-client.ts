import { Client } from '@microsoft/microsoft-graph-client';
import { MicrosoftAuthService } from './microsoft-auth.service';

export class MicrosoftGraphClient {
    protected readonly client: Client;

    constructor(
        readonly microsoftAuthService: MicrosoftAuthService,
    ) {
        this.client = Client.initWithMiddleware({
            authProvider: this.microsoftAuthService,
        });
    }
}