import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantInviteCode } from './tenant-invite-code.entity';
import { EmailTriggerWhitelistItem } from '../email-trigger-whitelist-item/email-trigger-whitelist-item.entity';
import { LicenseModule } from '../license/license.module';
import { TenantRoleAdminController } from './tenantRoleAdmin.controller';
import { TenantPublicController } from './tenantPublic.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '#/config/config.module';
import { ServerConfigService } from '#/config/server-config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tenant, TenantInviteCode, EmailTriggerWhitelistItem]),
        LicenseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ServerConfigService],
            useFactory: async (serverConfigService: ServerConfigService) => ({
                secret: serverConfigService.secret,
                verifyOptions: {
                    algorithms: ['HS512'],
                },
            })
        }),
    ],
    providers: [
        TenantService,
    ],
    controllers: [
        TenantController,
        TenantRoleAdminController,
        TenantPublicController,
    ],
    exports: [TenantService],
})
export class TenantModule {
}
