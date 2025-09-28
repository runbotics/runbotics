import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProcessCollectionService } from './process-collection.service';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from './process-collection.entity';
import { ProcessCollectionLinkService } from '../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../process-collection-user/process-collection-user.service';
import { PermissionManagementService } from '../permission-management/permission-management.service';
import { StrategyFactory } from './process-collection-strategy.factory';

vi.mock('./process-collection-strategy.factory');

describe('ProcessCollectionService', () => {
    let service: ProcessCollectionService;
    let repo: TreeRepository<ProcessCollection>;
    let linkService: ProcessCollectionLinkService;
    let userService: ProcessCollectionUserService;
    let permissionService: PermissionManagementService;
    let mockFactory: StrategyFactory;

    beforeEach(() => {
        repo = {} as any;
        linkService = {} as any;
        userService = {} as any;
        permissionService = {} as any;

        mockFactory = {
            createCreateStrategy: vi.fn(),
            createGetAllCollectionStrategy: vi.fn(),
            createDeleteStrategy: vi.fn(),
            createLoadTreeStrategy: vi.fn(),
            createUpdateStrategy: vi.fn(),
        } as any;

        // @ts-expect-error Mocking the factory method
        (StrategyFactory as unknown as vi.Mock).mockImplementation(() => mockFactory);

        service = new ProcessCollectionService(repo, linkService, userService, permissionService);
    });

    it('should call create strategy with dto and userId', async () => {
        const executeMock = vi.fn().mockResolvedValue({ id: '123' });
        // @ts-expect-error Mocking the factory methoda
        mockFactory.createCreateStrategy = vi.fn(() => ({ execute: executeMock }));

        const dto = { name: 'New', parentId: 'abc', users: [] };
        const userId = 42;

        const result = await service.createProcessCollection(dto as any, userId);

        expect(mockFactory.createCreateStrategy).toHaveBeenCalled();
        expect(executeMock).toHaveBeenCalledWith(dto, userId);
        expect(result).toEqual({ id: '123' });
    });

    it('should call getAll strategy with userId and parentId', async () => {
        const executeMock = vi.fn().mockResolvedValue([]);
        // @ts-expect-error Mocking the factory method
        mockFactory.createGetAllCollectionStrategy = vi.fn(() => ({ execute: executeMock }));

        const userId = 7;
        const parentId = 'xyz';

        const result = await service.getAllProcessCollections(userId, parentId);

        expect(mockFactory.createGetAllCollectionStrategy).toHaveBeenCalled();
        expect(executeMock).toHaveBeenCalledWith(userId, parentId);
        expect(result).toEqual([]);
    });

    it('should call delete strategy with collectionId', async () => {
        const executeMock = vi.fn().mockResolvedValue({ deleted: true });
        // @ts-expect-error Mocking the factory method
        mockFactory.createDeleteStrategy = vi.fn(() => ({ execute: executeMock }));

        const result = await service.deleteProcessCollection('abc');

        expect(mockFactory.createDeleteStrategy).toHaveBeenCalled();
        expect(executeMock).toHaveBeenCalledWith('abc');
        expect(result).toEqual({ deleted: true });
    });

    it('should call loadTree strategy with processCollectionId', async () => {
        const executeMock = vi.fn().mockResolvedValue({ id: 'root' });
        // @ts-expect-error Mocking the factory method
        mockFactory.createLoadTreeStrategy = vi.fn(() => ({ execute: executeMock }));

        const result = await service.getProcessCollectionTree('root');

        expect(mockFactory.createLoadTreeStrategy).toHaveBeenCalled();
        expect(executeMock).toHaveBeenCalledWith('root');
        expect(result).toEqual({ id: 'root' });
    });

    it('should call update strategy with id and dto', async () => {
        const executeMock = vi.fn().mockResolvedValue({ id: 'updated' });
        // @ts-expect-error Mocking the factory method
        mockFactory.createUpdateStrategy = vi.fn(() => ({ execute: executeMock }));

        const dto = { name: 'Updated', isPublic: true, users: [] };

        const result = await service.updateProcessCollection('col-1', dto as any);

        expect(mockFactory.createUpdateStrategy).toHaveBeenCalled();
        expect(executeMock).toHaveBeenCalledWith('col-1', dto);
        expect(result).toEqual({ id: 'updated' });
    });
});
