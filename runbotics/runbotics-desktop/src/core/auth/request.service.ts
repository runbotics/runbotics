import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import Axios from 'axios';

@Injectable()
export class RequestService {
    constructor(
        private readonly authService: AuthService,
    ) { }

    async getSchedulerAxios() {
        const authToken = await this.authService.getValidTokenData();

        return Axios.create({
            maxRedirects: 0,
            headers: {
                Authorization: `Bearer ${authToken.token}`
            }
        });
    }

    async getOrchestratorAxios() {
        const authToken = await this.authService.getValidTokenData();

        return Axios.create({
            maxRedirects: 0,
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    async getExternalAxios() {
        return Axios.create({ maxRedirects: 0 });
    }
}
