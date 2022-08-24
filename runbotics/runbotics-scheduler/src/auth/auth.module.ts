import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { ServerConfigService } from '../config/serverConfig.service';
import { BotModule } from '../database/bot/bot.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../database/user/user.module';
import { BotSystemModule } from '../database/bot_system/bot_system.module';
import { BotCollectionModule } from '../database/bot_collection/bot_collection.module';
import { RoleGuard } from './guards';
import { FeatureKeyGuard } from './guards/featureKey.guard';

const GlobalRoleGuard = {
    provide: APP_GUARD,
    useClass: RoleGuard,
};

const GlobalFeatureKeyGuard = {
    provide: APP_GUARD,
    useClass: FeatureKeyGuard,
}

@Module({
    imports: [
        ConfigModule,
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
    providers: [AuthService, JwtStrategy, GlobalRoleGuard, GlobalFeatureKeyGuard],
    exports: [AuthService, PassportModule],
})
export class AuthModule { }
