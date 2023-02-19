import { Logger } from 'src/utils/logger';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ServerConfigService } from './serverConfig.service';

const NODE_ENV = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
const envFile = '.env' + NODE_ENV;
Logger.print('info', ['Env file is: ' + envFile], 'Config');

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({ envFilePath: envFile }),
    ],
    providers: [
        ConfigService, ServerConfigService
    ],
    exports: [
        ConfigService, ServerConfigService
    ]
})
export class ConfigModule { }