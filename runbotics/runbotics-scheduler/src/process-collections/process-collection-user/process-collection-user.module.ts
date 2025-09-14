import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionUser } from './process-collection-user.entity';
import {
    ProcessCollectionUserService,
} from '#/process-collections/process-collection-user/process-collection-user.service';
import {
    ProcessCollectionUserController,
} from '#/process-collections/process-collection-user/process-collection-user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionUser])],
    providers: [ProcessCollectionUserService],
    controllers: [ProcessCollectionUserController],
    exports: [ProcessCollectionUserService],
})
export class ProcessCollectionUserModule {
}
