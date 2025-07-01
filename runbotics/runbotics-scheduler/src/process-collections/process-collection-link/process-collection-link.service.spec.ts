import { Test } from '@nestjs/testing';
import { ProcessCollectionLinkService } from './process-collection-link.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import { Repository, DeleteResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddProcessCollectionLinkDto } from '#/process-collections/process-collection-link/dto/add-process-collection-link.dto';

describe('ProcessCollectionLinkService', () => {
    let service: ProcessCollectionLinkService;
    let repository: Repository<ProcessCollectionLink>;

    const mockRepository = {
        save: vi.fn(),
        findOne: vi.fn(),
        delete: vi.fn(),
        find: vi.fn(),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProcessCollectionLinkService,
                {
                    provide: getRepositoryToken(ProcessCollectionLink),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = moduleRef.get<ProcessCollectionLinkService>(ProcessCollectionLinkService);
        repository = moduleRef.get<Repository<ProcessCollectionLink>>(getRepositoryToken(ProcessCollectionLink));

        vi.clearAllMocks();
    });

    it('should add a new ProcessCollectionLink', async () => {
        const dto: AddProcessCollectionLinkDto = {
            collectionId: 1,
            userId: 10,
        };

        const mockEntity: ProcessCollectionLink = {
            id: 'uuid-123',
            collectionId: 1,
            userId: 10,
            token: 'uuid-token-456',
            createdAt: new Date(),
            collection: {} as any,
            user: {} as any,
        };

        mockRepository.save.mockResolvedValue(mockEntity);

        const result = await service.addNewProcessCollectionLink(dto);

        expect(repository.save).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockEntity);
    });

    it('should return a ProcessCollectionLink by ID', async () => {
        const mockLink: ProcessCollectionLink = {
            id: 'uuid-abc',
            collectionId: 2,
            userId: 20,
            token: 'uuid-token-def',
            createdAt: new Date(),
            collection: {} as any,
            user: {} as any,
        };

        mockRepository.findOne.mockResolvedValue(mockLink);

        const result = await service.getProcessCollectionLink('uuid-abc');

        expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-abc' } });
        expect(result).toEqual(mockLink);
    });

    it('should delete a ProcessCollectionLink by ID', async () => {
        const mockDeleteResult: DeleteResult = {
            affected: 1,
            raw: [],
        };

        mockRepository.delete.mockResolvedValue(mockDeleteResult);

        const result = await service.deleteProcessCollectionLink('uuid-delete');

        expect(repository.delete).toHaveBeenCalledWith('uuid-delete');
        expect(result).toEqual(mockDeleteResult);
    });

    it('should return links by collectionId', async () => {
        const mockLinks: ProcessCollectionLink[] = [
            {
                id: 'uuid-1',
                collectionId: 5,
                userId: 30,
                token: 'token-1',
                createdAt: new Date(),
                collection: {} as any,
                user: {} as any,
            },
            {
                id: 'uuid-2',
                collectionId: 5,
                userId: 31,
                token: 'token-2',
                createdAt: new Date(),
                collection: {} as any,
                user: {} as any,
            },
        ];

        mockRepository.find.mockResolvedValue(mockLinks);

        const result = await service.getProcessCollectionLinkByCollectionId(5);

        expect(repository.find).toHaveBeenCalledWith({ where: { collectionId: 5 } });
        expect(result).toEqual(mockLinks);
    });
});
