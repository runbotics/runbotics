import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { CreateProcessCollectionDto } from '../dto/create-process-collection.dto';
import { ProcessCollection } from '../process-collection.entity';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import { PrivilegeType } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { inspect } from 'util';

export class CreateProcessCollectionStrategy implements CollectionStrategy<ProcessCollection> {
    private readonly logger = new Logger(CreateProcessCollectionStrategy.name);
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
        private readonly permissionManagementService: PermissionManagementService,
    ) {
    }

    async execute(dto: CreateProcessCollectionDto, userId?: number): Promise<ProcessCollection> {
        const parent = await this.repo.findOne({ where: { id: dto.parentId } });
        let root;
        if(!parent) {
            root = await this.repo.findOne({ where: { name: 'ROOT', description: 'ROOT', parent: null } });
        }
        const saved = await this.repo.save({
            ...dto,
            created_by: userId,
            parentId: dto.parentId,
            ownerId: (parent?.name === 'ROOT' || !parent) ? userId : parent.owner.id,
            parent: parent ? parent : root,
            userId,
        });
        
        if(dto.users && dto.users.length > 0) {
            this.logger.log(inspect(dto.users, {depth: 6}));
            for(const user of dto.users) {
                this.logger.log(`Granting permission for user ${user.id} on collection ${saved.id} with privilege type ${user.privilegeType}`);
                await this.permissionManagementService.grant(user.id, saved.id, user.privilegeType as PrivilegeType);
            }
        }
        return saved as ProcessCollection;
    }
}
