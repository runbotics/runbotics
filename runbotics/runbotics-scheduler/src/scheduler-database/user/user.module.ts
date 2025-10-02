import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Authority } from '../authority/authority.entity';
import { TenantModule } from '../tenant/tenant.module';
import { MailModule } from '#/mail/mail.module';
import { UserAccountController } from '#/scheduler-database/user/user-account.controller';


@Module({
    imports: [TypeOrmModule.forFeature([User, Authority]), TenantModule, MailModule],
    controllers: [UserController, UserAccountController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
