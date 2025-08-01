import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from './process.entity';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessCrudService } from '#/scheduler-database/process/process-crud.service';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tags/tag.module';
import { ProcessCredentialModule } from '../process-credential/process-credential.module';
import { ProcessCollectionModule } from '../process-collection/process-collection.module';
import { ProcessCollection } from '../process-collection/process-collection.entity';
import { BlacklistActionAuthModule } from '#/blacklist-actions-auth/blacklist-action-auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessEntity, ProcessCollection, GlobalVariable, BotCollection]),
        ProcessCollectionModule,
        forwardRef(() => UserModule),
        TagModule,
        forwardRef(() => ProcessCredentialModule),
        BlacklistActionAuthModule,
    ],
    exports: [ProcessService],
    providers: [ProcessService, ProcessCrudService],
    controllers: [ProcessController],
})
export class ProcessModule {
}
