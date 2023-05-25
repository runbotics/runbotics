import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { Logger } from '#/utils/logger';
import { ServerConfigService } from './server-config';

const NODE_ENV = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
const envFile = '.env' + NODE_ENV;
Logger.print('info', ['Env file is: ' + envFile], 'Config');

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({ envFilePath: envFile }),
    ],
    providers: [
        ServerConfigService
    ],
    exports: [
        ServerConfigService
    ]
})
export class ConfigModule { }