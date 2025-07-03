import { NestFactory } from '@nestjs/core';
import { setDefaultResultOrder } from 'dns';
import { json, urlencoded } from 'express';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { Logger } from './utils/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

setDefaultResultOrder('ipv4first');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: new Logger(), cors: true });
    app.use(morgan('[:date[web]] :remote-addr :url :method', { immediate: true }));
    app.use(json({ limit: '4mb' }));
    app.use(urlencoded({ extended: true, limit: '4mb' }));
    
    const config = new DocumentBuilder()
    .setTitle('Runbotics docs')
    .setDescription('The Runbotics API documentation')
    .setVersion('1.0')
    .addTag('tenant')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);


    await app.listen(4000);
}

bootstrap();
