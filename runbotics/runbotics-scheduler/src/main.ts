import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { Logger } from './utils/logger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: new Logger(), cors: true });
    app.use(morgan('[:date[web]] :remote-addr :url :method', { immediate: true }));
    await app.listen(4000);
}

bootstrap();
