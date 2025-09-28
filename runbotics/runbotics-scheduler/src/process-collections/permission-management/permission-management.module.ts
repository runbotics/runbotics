import { Module } from '@nestjs/common';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from './permission-management.repository';
import { PermissionManagementService } from './permission-management.service';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionUser, ProcessCollection])],
    providers: [PermissionRepository, PermissionManagementService],
    exports: [PermissionManagementService],
})
export class PermissionManagementModule {
}
