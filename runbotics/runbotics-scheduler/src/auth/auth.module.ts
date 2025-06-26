import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { ServerConfigService } from '../config/server-config/server-config.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RoleGuard } from './guards';
import { FeatureKeyGuard } from './guards/featureKey.guard';
import { BotModule } from '#/scheduler-database/bot/bot.module';
import { BotSystemModule } from '#/scheduler-database/bot-system/bot-system.module';
import { BotCollectionModule } from '#/scheduler-database/bot-collection/bot-collection.module';
import { UserModule } from '#/scheduler-database/user/user.module';

const GlobalRoleGuard = {
    provide: APP_GUARD,
    useClass: RoleGuard,
};

const GlobalFeatureKeyGuard = {
    provide: APP_GUARD,
    useClass: FeatureKeyGuard,
};

@Module({
    imports: [
        UserModule,
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        PassportModule,
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
        AuthService, JwtStrategy, GlobalRoleGuard, GlobalFeatureKeyGuard,
    ],
    exports: [AuthService, PassportModule],
})
export class AuthModule { }
