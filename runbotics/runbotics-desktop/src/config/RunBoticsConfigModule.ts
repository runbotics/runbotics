import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServerConfigService } from './ServerConfigService';
import { RunboticsLogger } from '../logger/RunboticsLogger';
import { StorageService } from './StorageService';

const NODE_ENV = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
const envFile = '.env' + NODE_ENV;
RunboticsLogger.print('info', ['Env file is: ' + envFile], 'Config', false);

@Module({
    imports: [
        NestConfigModule.forRoot({ envFilePath: envFile }),
    ],
    providers: [
        ConfigService, ServerConfigService, StorageService
    ],
    exports: [
        ConfigService, ServerConfigService, StorageService
    ]
})
export class ConfigModule { }
