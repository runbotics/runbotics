import { Module } from '@nestjs/common';

import { CoreModule } from '#core';
import { MailerModule } from '#mailer';

@Module({
    imports: [
        MailerModule,
        CoreModule,
    ],
})
export class AppModule {}
