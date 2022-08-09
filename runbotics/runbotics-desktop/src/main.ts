import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './config/axios-configuration';
import 'source-map-support/register';
import { RunboticsLogger } from './logger/RunboticsLogger';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: new RunboticsLogger() });
    app.enableShutdownHooks();
}

bootstrap();
