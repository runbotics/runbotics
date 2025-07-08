import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProcessCollectionService } from './process-collection.service';
import { ProcessCollectionLinkService } from './../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from './../process-collection-user/process-collection-user.service';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from './process-collection.entity';
import { StrategyFactory } from './process-collection-strategy.factory';
import { CreateProcessCollectionDto } from './dto/create-process-collection.dto';
import { UpdateProcessCollectionDto } from './dto/update-process-collection.dto';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';

vi.mock('../process-collection-strategy.factory');

describe('ProcessCollectionService', () => {
    let service: ProcessCollectionService;
    let mockRepo: TreeRepository<ProcessCollection>;
    let mockLinkService: ProcessCollectionLinkService;
    let mockUserService: ProcessCollectionUserService;
    let mockStrategyFactory: StrategyFactory;
    let mockPermissionManagementService: PermissionManagementService;

    beforeEach(() => {
        mockRepo = {} as unknown as TreeRepository<ProcessCollection>;
        mockLinkService = {} as ProcessCollectionLinkService;
        mockUserService = {} as ProcessCollectionUserService;
        mockPermissionManagementService = {} as PermissionManagementService;

        mockStrategyFactory = {
            createCreateStrategy: vi.fn(),
            cretateGetAllStrategy: vi.fn(),
            createDeleteStrategy: vi.fn(),
            createLoadTreeStrategy: vi.fn(),
            createUpdateStrategy: vi.fn(),
        } as unknown as StrategyFactory;

        // ręczne wstrzyknięcie factory (bo constructor sam tworzy nową instancję)
        service = new ProcessCollectionService(
            mockRepo,
            mockLinkService,
            mockUserService,
            mockPermissionManagementService,
        );
        (service as any).strategyFactory = mockStrategyFactory;
    });

    it('should call CreateProcessCollectionStrategy with correct DTO and userId', async () => {
        const dto: CreateProcessCollectionDto = { name: 'Test', description: 'Desc', parentId: null };
        const userId = 1;

        const mockResult = { id: 'abc', name: 'Test' } as ProcessCollection;
        const execute = vi.fn().mockResolvedValue(mockResult);
        (mockStrategyFactory.createCreateStrategy as any).mockReturnValue({ execute });

        const result = await service.createProcessCollection(dto, userId);

        expect(execute).toHaveBeenCalledWith(dto, userId);
        expect(result).toEqual(mockResult);
    });

    it('should call DeleteProcessCollectionStrategy with correct id', async () => {
        const id = 'collection-id';
        const mockResult = { id } as ProcessCollection;
        const execute = vi.fn().mockResolvedValue(mockResult);
        (mockStrategyFactory.createDeleteStrategy as any).mockReturnValue({ execute });

        const result = await service.deleteProcessCollection(id);

        expect(execute).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockResult);
    });

    it('should call LoadTreeStrategy with correct collectionId', async () => {
        const id = 'collection-id';
        const mockResult = { id, children: [] } as ProcessCollection;
        const execute = vi.fn().mockResolvedValue(mockResult);
        (mockStrategyFactory.createLoadTreeStrategy as any).mockReturnValue({ execute });

        const result = await service.getProcessCollectionTree(id);

        expect(execute).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockResult);
    });

    it('should call UpdateProcessCollectionStrategy with DTO', async () => {
        const dto: UpdateProcessCollectionDto = { name: 'new name', description: 'desc' };
        const mockResult = { ...dto } as ProcessCollection;
        const execute = vi.fn().mockResolvedValue(mockResult);
        (mockStrategyFactory.createUpdateStrategy as any).mockReturnValue({ execute });

        const result = await service.updateProcessCollection('id', dto);

        expect(execute).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockResult);
    });

    it('should call GetAllStrategy with userId and parentId', async () => {
        const userId = 1;
        const parentId = 'parent-1';
        const mockResult = [{ id: '1', name: 'A' }] as ProcessCollection[];
        const execute = vi.fn().mockResolvedValue(mockResult);
        (mockStrategyFactory.createGetAllCollectionStrategy as any).mockReturnValue({ execute });

        const result = await service.getAllProcessCollections(userId, parentId);

        expect(execute).toHaveBeenCalledWith(userId, parentId);
        expect(result).toEqual(mockResult);
    });
});
