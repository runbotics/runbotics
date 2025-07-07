import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProcessCollectionStrategy } from './create-process-collection.strategy';
import { DeleteProcessCollectionStrategy } from './delete-process-collection.strategy';
import { UpdateProcessCollectionStrategy } from './update-process-collection.strategy';
import { LoadProcessCollectionTreeStrategy } from './load-process-collection-tree.strategy';
import { GetAllCollectionsStrategy } from './get-all-collections.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateProcessCollectionStrategy', () => {
    let strategy: CreateProcessCollectionStrategy;
    let mockRepo: Partial<TreeRepository<ProcessCollection>>;

    beforeEach(() => {
        mockRepo = {
            findOne: vi.fn(),
            //@ts-expect-error save is a method of TreeRepository
            save: vi.fn(),
        };
        strategy = new CreateProcessCollectionStrategy(mockRepo as TreeRepository<ProcessCollection>);
    });

    it('should create collection with ROOT as parent', async () => {
        const dto = { name: 'New', description: '', parentId: 'root-id' };
        const parent = { id: 'root-id', name: 'ROOT', owner: { id: 1 } };
        const saved = { id: 'new-id', ...dto };

        (mockRepo.findOne as any).mockResolvedValue(parent);
        (mockRepo.save as any).mockResolvedValue(saved);

        const result = await strategy.execute(dto, 1);
        expect(result).toEqual(saved);
        expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
            name: dto.name,
            created_by: 1,
            ownerId: 1,
        }));
    });
});

describe('DeleteProcessCollectionStrategy', () => {
    let strategy: DeleteProcessCollectionStrategy;
    let mockRepo: Partial<TreeRepository<ProcessCollection>>;

    beforeEach(() => {
        mockRepo = {
            findOne: vi.fn(),
            delete: vi.fn(),
        };
        strategy = new DeleteProcessCollectionStrategy(mockRepo as TreeRepository<ProcessCollection>);
    });

    it('should throw if collection not found', async () => {
        (mockRepo.findOne as any).mockResolvedValue(null);
        await expect(strategy.execute('123')).rejects.toThrow(NotFoundException);
    });

    it('should delete collection and return raw result', async () => {
        const fakeCollection = { id: '123' };
        const raw = { raw: { deleted: true } };

        (mockRepo.findOne as any).mockResolvedValue(fakeCollection);
        (mockRepo.delete as any).mockResolvedValue(raw);

        const result = await strategy.execute('123');
        expect(result).toEqual(raw.raw);
        expect(mockRepo.delete).toHaveBeenCalledWith({ id: '123' });
    });
});

describe('UpdateProcessCollectionStrategy', () => {
    let strategy: UpdateProcessCollectionStrategy;
    let mockRepo: Partial<TreeRepository<ProcessCollection>>;

    beforeEach(() => {
        mockRepo = {
            findOne: vi.fn(),
            //@ts-expect-error save is a method of TreeRepository
            save: vi.fn(),
        };
        strategy = new UpdateProcessCollectionStrategy(mockRepo as TreeRepository<ProcessCollection>);
    });

    it('should throw if collection not found', async () => {
        (mockRepo.findOne as any).mockResolvedValue(null);
        await expect(strategy.execute({ id: 'abc', name: 'n', description: 'd' })).rejects.toThrowError();
    });

    it('should update and return saved collection', async () => {
        const existing = { id: 'abc', name: 'old', description: 'old desc' };
        const updated = { id: 'abc', name: 'new', description: 'new desc' };

        (mockRepo.findOne as any).mockResolvedValue(existing);
        (mockRepo.save as any).mockResolvedValue(updated);

        const result = await strategy.execute({ id: 'abc', name: 'new', description: 'new desc' });
        expect(result).toEqual(updated);
        expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'new' }));
    });
});

describe('LoadProcessCollectionTreeStrategy', () => {
    let strategy: LoadProcessCollectionTreeStrategy;
    let mockRepo: Partial<TreeRepository<ProcessCollection>>;
    let mockLinkService: any;
    let mockUserService: any;

    beforeEach(() => {
        mockRepo = {
            findOne: vi.fn(),
            findDescendantsTree: vi.fn(),
        };
        mockLinkService = {
            getProcessCollectionLinkByCollectionId: vi.fn(),
        };
        mockUserService = {
            getAllProcessCollectionUserByCollectionId: vi.fn(),
        };

        strategy = new LoadProcessCollectionTreeStrategy(
            mockRepo as TreeRepository<ProcessCollection>,
            mockLinkService,
            mockUserService,
        );
    });

    it('should return null if collection not found', async () => {
        (mockRepo.findOne as any).mockResolvedValue(null);
        const result = await strategy.execute('not-found');
        expect(result).toBeNull();
    });

    it('should return tree with links and privileges', async () => {
        const mockNode = { id: 'root', children: [] };
        const tree = { ...mockNode };

        (mockRepo.findOne as any).mockResolvedValue(mockNode);
        (mockRepo.findDescendantsTree as any).mockResolvedValue(tree);
        mockLinkService.getProcessCollectionLinkByCollectionId.mockResolvedValue([]);
        mockUserService.getAllProcessCollectionUserByCollectionId.mockResolvedValue([]);

        const result = await strategy.execute('root');
        expect(result.id).toBe('root');
        expect(result.processCollectionLinks).toEqual([]);
        expect(result.processCollectionPrivileges).toEqual([]);
    });
});

describe('GetAllCollectionsStrategy', () => {
    let strategy: GetAllCollectionsStrategy;
    let mockRepo: Partial<TreeRepository<ProcessCollection>>;
    let mockLinkService: any;
    let mockUserService: any;

    beforeEach(() => {
        mockRepo = {
            findOne: vi.fn(),
            findDescendantsTree: vi.fn(),
        };
        mockLinkService = {
            getProcessCollectionLinkByCollectionId: vi.fn(),
        };
        mockUserService = {
            getAllProcessCollectionUserByCollectionId: vi.fn(),
        };

        strategy = new GetAllCollectionsStrategy(
            mockRepo as TreeRepository<ProcessCollection>,
            mockLinkService,
            mockUserService,
        );
    });

    it('should return null if parent not found', async () => {
        (mockRepo.findOne as any).mockResolvedValue(null);
        const result = await strategy.execute(1, 'nonexistent');
        expect(result).toBeNull();
    });

    it('should return user root collection if found', async () => {
        const root = {
            id: 'root',
            name: 'ROOT',
            description: 'ROOt',
            parent: null,
            children: [
                { id: 'child-1', ownerId: 1, children: [] },
                { id: 'child-2', ownerId: 2, children: [] },
            ],
        };

        (mockRepo.findOne as any).mockResolvedValue(root);
        (mockRepo.findDescendantsTree as any).mockResolvedValue(root);
        mockLinkService.getProcessCollectionLinkByCollectionId.mockResolvedValue([]);
        mockUserService.getAllProcessCollectionUserByCollectionId.mockResolvedValue([]);

        const result = await strategy.execute(1);
        expect(result.id).toBe('child-1');
        expect(result.processCollectionLinks).toEqual([]);
        expect(result.processCollectionPrivileges).toEqual([]);
    });
});
