import { Module } from '@nestjs/common';
import { MsalController } from './msal.controler';
import { MsalService } from './msal.service';
import { AuthModule } from '#/auth/auth.module';
import { ConfigModule } from '#/config/config.module';

@Module({
    imports: [AuthModule, ConfigModule],
    controllers: [MsalController],
    providers: [MsalService],
    exports: [MsalService]
})
export class MsalModule {}
