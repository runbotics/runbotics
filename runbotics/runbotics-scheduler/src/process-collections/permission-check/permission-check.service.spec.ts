// import { describe, it, expect, beforeEach, vi } from 'vitest';
// import { OwnerHandler } from './chain/owner.handler';
// import { TreeRepository } from 'typeorm';
// import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
// import { NotFoundException } from '@nestjs/common';
// import { AuthRequest } from '#/types';
//
// describe('OwnerHandler', () => {
//     let handler: OwnerHandler;
//     let repository: Partial<Record<keyof TreeRepository<ProcessCollection>, any>>;
//
//     const mockRequest: AuthRequest = {
//         user: { id: 100 },
//     } as AuthRequest;
//
//     beforeEach(() => {
//         repository = {
//             findOne: vi.fn(),
//         };
//
//         handler = new OwnerHandler(repository as TreeRepository<ProcessCollection>);
//         vi.clearAllMocks();
//     });
//
//     it('should authorize if user is the owner', async () => {
//         const mockCollection: ProcessCollection = {
//             id: 1,
//             createdBy: { id: 100 },
//         } as any;
//
//         repository.findOne.mockResolvedValue(mockCollection);
//
//         const result = await handler.handle(mockRequest, 1);
//
//         expect(repository.findOne).toHaveBeenCalledWith({
//             where: { id: 1 },
//             relations: ['createdBy'],
//         });
//         expect(result).toBe(true);
//     });
//
//     it('should call super.handle if user is not the owner', async () => {
//         const mockCollection: ProcessCollection = {
//             id: 1,
//             createdBy: { id: 999 },
//         } as any;
//
//         repository.findOne.mockResolvedValue(mockCollection);
//
//         // spy on super.handle
//         const superHandleSpy = vi.spyOn(Object.getPrototypeOf(OwnerHandler.prototype), 'handle');
//         superHandleSpy.mockResolvedValue(false);
//
//         const result = await handler.handle(mockRequest, 1);
//
//         expect(superHandleSpy).toHaveBeenCalledWith(mockRequest);
//         expect(result).toBe(false);
//     });
//
//     it('should throw NotFoundException if no collection found', async () => {
//         repository.findOne.mockResolvedValue(null);
//
//         await expect(() => handler.handle(mockRequest, 1)).rejects.toThrow(NotFoundException);
//     });
// });
