import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ServerConfigService } from './server-config.service';
import { LogLevel, RunboticsLogger } from '../logger/RunboticsLogger';
import { StorageService } from './storage.service';
import { ArgumentsService } from './arguments.service';

const NODE_ENV = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
const envFile = '.env' + NODE_ENV;
RunboticsLogger.print(LogLevel.INFO, ['Env file is: ' + envFile], 'Config', false);

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({ envFilePath: envFile }),
    ],
    providers: [
        ConfigService,
        ServerConfigService,
        StorageService,
        ArgumentsService
    ],
    exports: [
        ConfigService,
        ServerConfigService,
        StorageService,
        ArgumentsService
    ]
})
export class ConfigModule {}
