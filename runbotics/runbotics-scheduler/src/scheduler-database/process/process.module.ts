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

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessEntity, ProcessCollection, GlobalVariable, BotCollection]),
        ProcessCollectionModule,
        UserModule,
        TagModule,
        forwardRef(() => ProcessCredentialModule),
    ],
    exports: [ProcessService],
    providers: [ProcessService, ProcessCrudService],
    controllers: [ProcessController],
})
export class ProcessModule {
}
