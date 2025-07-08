import { NestFactory } from '@nestjs/core';
import { setDefaultResultOrder } from 'dns';
import { json, urlencoded } from 'express';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { Logger } from './utils/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { SwaggerTags } from './utils/swaggerTags';

setDefaultResultOrder('ipv4first');
patchNestJsSwagger();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: new Logger(), cors: true });
    app.use(morgan('[:date[web]] :remote-addr :url :method', { immediate: true }));
    app.use(json({ limit: '4mb' }));
    app.use(urlencoded({ extended: true, limit: '4mb' }));
    let config = new DocumentBuilder()
    .setTitle('Runbotics docs')
    .setDescription('The Runbotics API documentation')
    .setVersion('1.0');

    Object.values(SwaggerTags).forEach(tag => {
        config = config.addTag(tag);
    });

    //TODO: zmienna srodowiskowa z info kiedy ma być uruchomiony 
    const document = SwaggerModule.createDocument(app, config.build());
    SwaggerModule.setup('docs', app, document);


    await app.listen(4000);
}

bootstrap();
