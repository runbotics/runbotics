import { Test } from '@nestjs/testing';
import { ProcessCollectionService } from './process-collection.service';
import { ProcessCollection } from './process-collection.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessCollectionLinkService } from '../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../process-collection-user/process-collection-user.service';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';

describe('ProcessCollectionService', () => {
    let service: ProcessCollectionService;

    const mockRepo = {
        findOne: vi.fn(),
        findDescendantsTree: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
    };

    const mockLinkService = {
        getProcessCollectionLinkByCollectionId: vi.fn(),
    };

    const mockUserService = {
        getAllProcessCollectionUserByCollectionId: vi.fn(),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProcessCollectionService,
                {
                    provide: getRepositoryToken(ProcessCollection),
                    useValue: mockRepo,
                },
                {
                    provide: ProcessCollectionLinkService,
                    useValue: mockLinkService,
                },
                {
                    provide: ProcessCollectionUserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        service = moduleRef.get(ProcessCollectionService);

        Object.values(mockRepo).forEach((fn) => fn.mockReset());
        Object.values(mockLinkService).forEach((fn) => fn.mockReset());
        Object.values(mockUserService).forEach((fn) => fn.mockReset());
    });

    describe('insertNewProcessCollection', () => {
        it('should insert a new process collection with parent', async () => {
            const dto = { name: 'Test', parentId: 1, description: 'Test Desc' };
            const parent = { id: 1, name: 'Parent' };
            const saved = { id: 2, name: 'Test', parent };

            mockRepo.findOne.mockResolvedValue(parent);
            mockRepo.save.mockResolvedValue(saved);

            const result = await service.insertNewProcessCollection(dto, 99);

            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.parentId } });
            expect(mockRepo.save).toHaveBeenCalledWith({
                ...dto,
                createdBy: null,
                parentId: dto.parentId,
                parent,
                userId: 99,
            });
            expect(result).toEqual(saved);
        });
    });

    describe('deleteProcessCollection', () => {
        it('should delete an existing process collection', async () => {
            const collection = { id: 1, name: 'ToDelete' };
            const deletionResult = { raw: collection };

            mockRepo.findOne.mockResolvedValue(collection);
            mockRepo.delete.mockResolvedValue(deletionResult);

            const result = await service.deleteProcessCollection(1);

            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepo.delete).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual(collection);
        });

        it('should throw NotFoundException when not found', async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(() => service.deleteProcessCollection(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getProcessCollectionTree', () => {
        it('should return null if base collection is not found', async () => {
            mockRepo.findOne.mockResolvedValue(null);

            const result = await service.getProcessCollectionTree(100);

            expect(result).toBeNull();
        });

        it('should return the tree with loaded relations', async () => {
            const base = { id: 1, name: 'Root', children: [] };
            const tree = { ...base, children: [] };

            mockRepo.findOne.mockResolvedValue(base);
            mockRepo.findDescendantsTree.mockResolvedValue(tree);
            mockLinkService.getProcessCollectionLinkByCollectionId.mockResolvedValue([]);
            mockUserService.getAllProcessCollectionUserByCollectionId.mockResolvedValue([]);

            const result = await service.getProcessCollectionTree(1);

            expect(mockRepo.findDescendantsTree).toHaveBeenCalledWith(base);
            expect(result).toMatchObject({
                id: 1,
                processCollectionLinks: [],
                processCollectionPrivileges: [],
                children: [],
            });
        });
    });

    describe('loadRelationsRecursive', () => {
        it('should recursively load children and their relations', async () => {
            const collection = {
                id: 1,
                children: [
                    {
                        id: 2,
                        children: [],
                    },
                ],
            };

            mockLinkService.getProcessCollectionLinkByCollectionId
                .mockResolvedValueOnce(['link1'])
                .mockResolvedValueOnce(['link2']);
            mockUserService.getAllProcessCollectionUserByCollectionId
                .mockResolvedValueOnce(['priv1'])
                .mockResolvedValueOnce(['priv2']);

            const result = await service.loadRelationsRecursive(collection as any);

            expect(result.processCollectionLinks).toEqual(['link1']);
            expect(result.processCollectionPrivileges).toEqual(['priv1']);
            expect(result.children[0].processCollectionLinks).toEqual(['link2']);
            expect(result.children[0].processCollectionPrivileges).toEqual(['priv2']);
        });
    });
});
