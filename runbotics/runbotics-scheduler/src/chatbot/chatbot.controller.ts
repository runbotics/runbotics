import { Public } from '#/auth/guards';
import { ServerConfigService } from '#/config/server-config';
import { Logger } from '#/utils/logger/logger';
import {
    Controller,
    Get,
    InternalServerErrorException,
    Ip,
} from '@nestjs/common';
import Axios, { AxiosRequestConfig } from 'axios';

interface GenerateToken {
    chatId?: string;
    user: {
        id: string;
        name: string;
        email?: string;
    };
    authorization?:
        | {
              authType: 'BASIC';
              user: string;
              password: string;
          }
        | {
              authType: 'BEARER';
              token: string;
          };
}

@Public()
@Controller('scheduler')
export class ChatbotController {
    private readonly logger = new Logger(ChatbotController.name);

    constructor(private readonly serverConfig: ServerConfigService) {}

    @Get('chatbot/GenerateToken')
    async generateToken(@Ip() ip: string) {
        const { apiKey, applicationId, uri } = this.serverConfig.chatbotConfig;
        this.logger.log(
            `<= Getting request to generate token for application with id (${applicationId})`
        );

        const body: GenerateToken = {
            chatId: ip,
            user: {
                id: ip,
                name: 'User',
                email: 'marcin.depcik@all-for-one.com',
            },
        };

        const config: AxiosRequestConfig<unknown> = {
            headers: {
                Authorization: apiKey,
            },
        };

        const chatAccessToken = await Axios.post<{ chatAccessToken: string }>(
            `${uri}/api/application/${applicationId}/GenerateToken`,
            body,
            config
        )
            .then((res) => {
                this.logger.log(
                    'Got new chat access token: ',
                    res.data.chatAccessToken
                );

                return res.data.chatAccessToken;
            })
            .catch((error) => {
                this.logger.error(error);

                throw new InternalServerErrorException(error.message);
            });

        return { chatAccessToken };
    }
}
