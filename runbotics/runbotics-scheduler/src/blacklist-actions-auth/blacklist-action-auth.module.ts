import { Module } from '@nestjs/common';
import { BlacklistGuard } from '#/blacklist-actions-auth/blacklist.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistActionAuthService } from '#/blacklist-actions-auth/blacklist-action-auth.service';
import { BlacklistActionAuthController } from '#/blacklist-actions-auth/blacklist-action-auth.controller';

@Module({
    imports: [TypeOrmModule.forFeature()],
    providers: [BlacklistGuard, BlacklistActionAuthService],
    exports: [BlacklistGuard, BlacklistActionAuthService],
    controllers: [BlacklistActionAuthController],
})
export class BlacklistActionAuthModule {}
