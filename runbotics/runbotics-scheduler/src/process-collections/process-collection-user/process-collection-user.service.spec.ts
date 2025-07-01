import { Test } from '@nestjs/testing';
import { ProcessCollectionUserService } from './process-collection-user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessCollectionUser } from './process-collection-user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddProcessCollectionUserDto } from './dto/add-process-collection-user.dto';
import { PrivilegeType } from 'runbotics-common';

describe('ProcessCollectionUserService', () => {
    let service: ProcessCollectionUserService;
    let repository: Repository<ProcessCollectionUser>;

    const mockRepository = {
        save: vi.fn(),
        findOne: vi.fn(),
        delete: vi.fn(),
        find: vi.fn(),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProcessCollectionUserService,
                {
                    provide: getRepositoryToken(ProcessCollectionUser),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = moduleRef.get<ProcessCollectionUserService>(ProcessCollectionUserService);
        repository = moduleRef.get<Repository<ProcessCollectionUser>>(getRepositoryToken(ProcessCollectionUser));

        vi.clearAllMocks();
    });

    it('should add a new ProcessCollectionUser', async () => {
        const userId = 42;
        const dto: AddProcessCollectionUserDto = {
            collectionId: 10,
            privilegeType: PrivilegeType.WRITE,
        };

        const savedEntity: ProcessCollectionUser = {
            id: '123',
            userId,
            processCollectionId: dto.collectionId,
            privilege_type: dto.privilegeType,
            user: {} as any,
            processCollection: {} as any,
        };

        mockRepository.save.mockResolvedValue(savedEntity);

        const result = await service.addNewProcessCollectionUser(userId, dto);

        expect(repository.save).toHaveBeenCalledWith({
            userId,
            processCollectionId: dto.collectionId,
            privilege_type: dto.privilegeType,
        });

        expect(result).toEqual(savedEntity);
    });

    it('should return a ProcessCollectionUser by userId and collectionId', async () => {
        const mockUser: ProcessCollectionUser = {
            id: '456',
            userId: 5,
            processCollectionId: 99,
            privilege_type: PrivilegeType.READ,
            user: {} as any,
            processCollection: {} as any,
        };

        mockRepository.findOne.mockResolvedValue(mockUser);

        const result = await service.getProcessCollectionUser(5, 99);

        expect(repository.findOne).toHaveBeenCalledWith({ where: { userId: 5, processCollectionId: 99 } });
        expect(result).toEqual(mockUser);
    });

    it('should delete a ProcessCollectionUser by userId and collectionId', async () => {
        const mockDeleteResult: DeleteResult = {
            affected: 1,
            raw: [],
        };

        mockRepository.delete.mockResolvedValue(mockDeleteResult);

        const result = await service.deleteProcessCollectionUser(1, 2);

        expect(repository.delete).toHaveBeenCalledWith({ userId: 1, processCollectionId: 2 });
        expect(result).toEqual(mockDeleteResult);
    });

    it('should return all ProcessCollectionUsers by collectionId', async () => {
        const users: ProcessCollectionUser[] = [
            {
                id: 'a1',
                userId: 1,
                processCollectionId: 50,
                privilege_type: PrivilegeType.WRITE,
                user: {} as any,
                processCollection: {} as any,
            },
            {
                id: 'a2',
                userId: 2,
                processCollectionId: 50,
                privilege_type: PrivilegeType.READ,
                user: {} as any,
                processCollection: {} as any,
            },
        ];

        mockRepository.find.mockResolvedValue(users);

        const result = await service.getAllProcessCollectionUserByCollectionId(50);

        expect(repository.find).toHaveBeenCalledWith({ where: { processCollectionId: 50 } });
        expect(result).toEqual(users);
    });
});
