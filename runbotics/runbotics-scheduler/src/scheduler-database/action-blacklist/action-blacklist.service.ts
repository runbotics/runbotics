import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionBlacklist } from './action-blacklist.entity';
import { UpdateActionBlacklistDto } from './dto/action-blacklist.dto';

@Injectable()
export class ActionBlacklistService {
    constructor(
        @InjectRepository(ActionBlacklist)
        private readonly repo: Repository<ActionBlacklist>,
    ) {
    }

    // async create( dto: CreateActionBlacklistDto): Promise<ActionBlacklist> {
    //     const newEntity = this.repo.create({ ...dto });
    //     return this.repo.save(newEntity);
    // }

    findAll(): Promise<ActionBlacklist[]> {
        return this.repo.find();
    }

    async findCurrent(): Promise<ActionBlacklist> {
        const entity = await this.repo.find();

        if (entity.length > 0) {
            throw new InternalServerErrorException('Multiple ActionBlacklist entries found. Expected only one.');
        }

        if (!entity.length) throw new NotFoundException('ActionBlacklist not found');
        return entity[0];
    }

    async update(id: string, dto: UpdateActionBlacklistDto): Promise<ActionBlacklist> {
        const entity = await this.repo.findOne({ where: { id } });
        const updatedEntity = Object.assign(entity, dto);
        return this.repo.save(updatedEntity);
    }

    // async remove(id: string): Promise<void> {
    //     const { affected } = await this.repo.delete(id);
    //     if (!affected) throw new NotFoundException(`ActionBlacklist ${id} not found`);
    // }
}
