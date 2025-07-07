import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
import {
    PermissionStrategy
} from '#/process-collections/permission-management/strategies/permission-strategy.interface';

export class RevokePermissionStrategy implements PermissionStrategy {
    constructor(
        private readonly userId: number,
        private readonly collectionId: string,
        private readonly accessRepo: PermissionRepository,
    ) {}
    // TODO: implement function to revoke permission in whole tree of ProcessCollection, not only removing 1 table entry
    async execute(): Promise<void> {
        await this.accessRepo.revokeAccess(this.userId, this.collectionId);
    }
}
