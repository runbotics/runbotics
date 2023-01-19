import { Module } from '@nestjs/common';

import { CoreModule } from '#core';

@Module({
    imports: [CoreModule],
})
export class AppModule {}
