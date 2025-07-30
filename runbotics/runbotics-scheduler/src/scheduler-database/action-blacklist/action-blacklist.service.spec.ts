import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionBlacklistService } from '#/scheduler-database/action-blacklist/action-blacklist.service';
import { ActionBlacklist } from '#/scheduler-database/action-blacklist/action-blacklist.entity';
import { ACTION_GROUP } from 'runbotics-common';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

function mockRepository() {
    return {
        create: vi.fn(),
        save: vi.fn(),
        find: vi.fn(),
        findOne: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    } as unknown as Repository<ActionBlacklist>;
}

describe('ActionBlacklistService', () => {
    let service: ActionBlacklistService;
    let repo: Repository<ActionBlacklist>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActionBlacklistService,
                {
                    provide: getRepositoryToken(ActionBlacklist),
                    useValue: mockRepository(),
                },
            ],
        }).compile();

        service = module.get(ActionBlacklistService);
        repo = module.get(getRepositoryToken(ActionBlacklist));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // it('create() should persist entity', async () => {
    //     const dto = { tenantId: 'id', environment: 'dev' } as any;
    //     const entity = { id: 'uuid', ...dto } as ActionBlacklist;
    //     repo.save = vi.fn().mockResolvedValue(entity);
    //
    //     const result = await service.create(dto);
    //
    //     expect(repo.save).toHaveBeenCalledWith(dto);
    //     expect(result).toEqual(entity);
    // });

    it('findAll() should return all entities', async () => {
        const entities = [{ id: 'uuid1' }, { id: 'uuid2' }] as ActionBlacklist[];
        repo.find = vi.fn().mockResolvedValue(entities);

        const result = await service.findAll();

        expect(repo.find).toHaveBeenCalled();
        expect(result).toEqual(entities);
    });

    it('findAll() should return all entities but empty array', async () => {
        const entities = [] as ActionBlacklist[];
        repo.find = vi.fn().mockResolvedValue(entities);

        const result = await service.findAll();

        expect(repo.find).toHaveBeenCalled();
        expect(result).toEqual(entities);
    });

    it('should return the only ActionBlacklist entity if exactly one exists', async () => {
        const fakeEntity: ActionBlacklist = { id: '1' } as ActionBlacklist;
        repo.find = vi.fn().mockResolvedValue([fakeEntity]);

        const result = await service.findCurrent();

        expect(result).toBe(fakeEntity);
        expect(repo.find).toHaveBeenCalledOnce();
    });

    it('should throw InternalServerErrorException if multiple entries exist', async () => {
        const fakeEntities: ActionBlacklist[] = [
            { id: '1' } as ActionBlacklist,
            { id: '2' } as ActionBlacklist,
        ];
        repo.find = vi.fn().mockResolvedValue(fakeEntities);

        await expect(() => service.findCurrent()).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw NotFoundException if no entries exist', async () => {
        repo.find = vi.fn().mockResolvedValue([]);

        await expect(() => service.findCurrent()).rejects.toThrow(NotFoundException);
    });

    it('update() should persist entity', async () => {
        const id = 'uuid';
        const entity = {
            blacklistAction: [ACTION_GROUP.API, ACTION_GROUP.CSV],
        } as Partial<ActionBlacklist>;
        repo.findOne = vi.fn().mockResolvedValue({ id, ...entity });
        repo.save = vi.fn().mockResolvedValue({ id, ...entity });

        const result = await service.update(id, entity);

        expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
        expect(repo.save).toHaveBeenCalled();
        expect(result).toEqual({ ...entity, id });
    });
});
