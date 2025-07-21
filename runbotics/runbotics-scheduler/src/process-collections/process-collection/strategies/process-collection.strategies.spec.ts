import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TreeRepository } from 'typeorm';

import { CreateProcessCollectionStrategy } from './create-process-collection.strategy';
import { DeleteProcessCollectionStrategy } from './delete-process-collection.strategy';
import { GetAllCollectionsStrategy } from './get-all-collections.strategy';
import { UpdateProcessCollectionStrategy } from './update-process-collection.strategy';
import { LoadProcessCollectionTreeStrategy } from './load-process-collection-tree.strategy';

import { ProcessCollection } from '../process-collection.entity';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import { ProcessCollectionLinkService } from '../../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../../process-collection-user/process-collection-user.service';

describe('CreateProcessCollectionStrategy', () => {
    let repo: TreeRepository<ProcessCollection>;
    let permissionService: PermissionManagementService;

    beforeEach(() => {
        repo = {
            findOne: vi.fn(),
            save: vi.fn(),
        } as any;

        permissionService = {
            grant: vi.fn(),
        } as any;
    });

    it('should create a collection with parent', async () => {
        const strategy = new CreateProcessCollectionStrategy(repo, permissionService);

        const dto = {
            parentId: 'parent-id',
            name: 'New Collection',
            users: [{ id: 1, privilegeType: 'READ' }],
        };

        const parent = { id: 'parent-id', name: 'ROOT', owner: { id: 2 } };

        (repo.findOne as any)
            .mockResolvedValueOnce(parent);

        (repo.save as any).mockResolvedValueOnce({ id: 'new-id', ...dto });

        const result = await strategy.execute(dto as any, 1);

        expect(result.id).toBe('new-id');
        expect(permissionService.grant).toHaveBeenCalledWith(1, 'new-id', 'READ');
    });
});

describe('DeleteProcessCollectionStrategy', () => {
    let repo: TreeRepository<ProcessCollection>;

    beforeEach(() => {
        repo = {
            findOne: vi.fn(),
            delete: vi.fn(),
        } as any;
    });

    it('should delete collection if exists', async () => {
        const strategy = new DeleteProcessCollectionStrategy(repo);

        (repo.findOne as any).mockResolvedValue({ id: '123' });
        (repo.delete as any).mockResolvedValue({ raw: { deleted: true } });

        const result = await strategy.execute('123');

        expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if not exists', async () => {
        const strategy = new DeleteProcessCollectionStrategy(repo);

        (repo.findOne as any).mockResolvedValue(null);

        await expect(() => strategy.execute('not-found')).rejects.toThrow(
            'ProcessCollection with id not-found not found');
    });
});

describe('GetAllCollectionsStrategy', () => {
    let repo: TreeRepository<ProcessCollection>;
    let linkService: ProcessCollectionLinkService;
    let userService: ProcessCollectionUserService;

    beforeEach(() => {
        repo = {
            findOne: vi.fn(),
            findDescendantsTree: vi.fn(),
        } as any;

        linkService = {
            getProcessCollectionLinkByCollectionId: vi.fn(),
        } as any;

        userService = {
            getAllProcessCollectionUserByCollectionId: vi.fn(),
        } as any;
    });

    it('should return user\'s root collection tree', async () => {
        const strategy = new GetAllCollectionsStrategy(repo, linkService, userService);
        const userId = 5;
        const root = {
            name: 'ROOT',
            description: 'ROOt',
            parent: null,
            children: [{ id: 'child-1', ownerId: 5, children: [] }],
        };

        (repo.findOne as any).mockResolvedValue(root);
        (repo.findDescendantsTree as any).mockResolvedValue(root);

        const result = await strategy.execute(userId);

        expect(result?.children?.length).toBe(0);
    });
});

describe('LoadProcessCollectionTreeStrategy', () => {
    let repo: TreeRepository<ProcessCollection>;
    let linkService: ProcessCollectionLinkService;
    let userService: ProcessCollectionUserService;

    beforeEach(() => {
        repo = {
            findOne: vi.fn(),
            findDescendantsTree: vi.fn(),
        } as any;

        linkService = {
            getProcessCollectionLinkByCollectionId: vi.fn().mockResolvedValue([]),
        } as any;

        userService = {
            getAllProcessCollectionUserByCollectionId: vi.fn().mockResolvedValue([]),
        } as any;
    });

    it('should return full tree for given collection id', async () => {
        const strategy = new LoadProcessCollectionTreeStrategy(repo, linkService, userService);

        const node = { id: 'abc', children: [] };
        (repo.findOne as any).mockResolvedValue(node);
        (repo.findDescendantsTree as any).mockResolvedValue(node);

        const result = await strategy.execute('abc');

        expect(result?.id).toBe('abc');
    });

    it('should return null if collection not found', async () => {
        const strategy = new LoadProcessCollectionTreeStrategy(repo, linkService, userService);

        (repo.findOne as any).mockResolvedValue(null);

        const result = await strategy.execute('non-existing');
        expect(result).toBeNull();
    });
});

describe('UpdateProcessCollectionStrategy', () => {
    let repo: TreeRepository<ProcessCollection>;
    let permissionService: PermissionManagementService;

    beforeEach(() => {
        repo = {
            manager: {
                transaction: vi.fn(),
            },
        } as any;

        permissionService = {
            grant: vi.fn(),
            revoke: vi.fn(),
        } as any;
    });

    it('should update process collection and permissions', async () => {
        const strategy = new UpdateProcessCollectionStrategy(repo, permissionService);

        const mockTransaction = vi.fn().mockImplementation(async fn => {
            const manager = {
                findOne: vi.fn().mockResolvedValue({
                    id: 'col-1',
                    name: 'Old',
                    description: 'Old Desc',
                    parent: null,
                    children: [],
                }),
                find: vi.fn().mockResolvedValue([
                    { userId: 1, privilege_type: 'READ' },
                ]),
                remove: vi.fn(),
                save: vi.fn().mockImplementation((entityName,entity) => Promise.resolve(entity)),
            };

            return await fn(manager);
        });

        repo.manager.transaction = mockTransaction;

        const updates = {
            name: 'Updated',
            description: 'Updated Desc',
            isPublic: true,
            users: [{ id: 1, privilegeType: 'WRITE' }],
        };

        const result = await strategy.execute('col-1', updates as any);
        console.log(result.name);
        expect(result.name).toBe('Updated');
        expect(permissionService.revoke).toHaveBeenCalled();
        expect(permissionService.grant).toHaveBeenCalled();
    });
});
