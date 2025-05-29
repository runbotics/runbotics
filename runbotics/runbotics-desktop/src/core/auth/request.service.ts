import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import Axios from 'axios';
import { ServerConfigService } from '#config';

@Injectable()
export class RequestService {
    constructor(
        private readonly authService: AuthService,
        private readonly serverConfigService: ServerConfigService,
    ) { }

    async getSchedulerAxios() {
        const authToken = await this.authService.getValidTokenData();
        
        return Axios.create({
            maxRedirects: 0,
            baseURL: this.serverConfigService.entrypointSchedulerUrl,
            headers: {
                Authorization: `Bearer ${authToken.token}`
            }
        });
    }
    
    async getExternalAxios() {
        return Axios.create({ maxRedirects: 0 });
    }
}
