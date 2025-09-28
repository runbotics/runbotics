import { TreeRepository } from 'typeorm';
import { ProcessCollection } from './process-collection.entity';
import { ProcessCollectionLinkService } from '../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../process-collection-user/process-collection-user.service';
import { DeleteProcessCollectionStrategy } from './strategies/delete-process-collection.strategy';
import { CreateProcessCollectionStrategy } from './strategies/create-process-collection.strategy';
import { LoadProcessCollectionTreeStrategy } from './strategies/load-process-collection-tree.strategy';
import { UpdateProcessCollectionStrategy } from './strategies/update-process-collection.strategy';
import {
    GetAllCollectionsStrategy
} from '#/process-collections/process-collection/strategies/get-all-collections.strategy';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import {
    SetProcessCollectionPublicStrategy
} from '#/process-collections/process-collection/strategies/set-public.strategy';

export class StrategyFactory {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
        private readonly linkService: ProcessCollectionLinkService,
        private readonly userService: ProcessCollectionUserService,
        private readonly permissionManagementService: PermissionManagementService,
    ) {
    }

    createCreateStrategy() {
        return new CreateProcessCollectionStrategy(this.repo, this.permissionManagementService);
    }

    createDeleteStrategy() {
        return new DeleteProcessCollectionStrategy(this.repo);
    }

    createLoadTreeStrategy() {
        return new LoadProcessCollectionTreeStrategy(this.repo, this.linkService, this.userService);
    }
    
    createUpdateStrategy() {
        return new UpdateProcessCollectionStrategy(this.repo, this.permissionManagementService);
    }
    
    createGetAllCollectionStrategy() {
        return new GetAllCollectionsStrategy(this.repo, this.linkService, this.userService);
    }
    
    createSetPublicStrategy() {
        return new SetProcessCollectionPublicStrategy(this.repo);
    }
}
