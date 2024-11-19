import { BadRequestException, Injectable } from '@nestjs/common';

import { Logger } from '#/utils/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '#/scheduler-database/user/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
    private readonly logger = new Logger(TagService.name);

    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
    ) {}

    async getAll(tenantId: string, searchPhrase?: string) {
        const lookupPhrase = searchPhrase ? `%${searchPhrase}%` : '%%';

        return await this.tagRepository
            .createQueryBuilder('tag')
            .where('tag.tenant_id = :tenantId', { tenantId })
            .andWhere('tag.name LIKE :lookupPhrase', { lookupPhrase })
            .getMany();
    }

    getById(id: number, user: User) {
        return this.tagRepository.findOneBy({ id, tenantId: user.tenantId });
    }

    async create(user: User, tagDto: CreateTagDto) {
        const existingTag = await this.tagRepository.findOneBy({ tenantId: user.tenantId, name: tagDto.name });

        if (existingTag) {
            throw new BadRequestException('Tag with this name already exists', 'NameNotUnique');
        }

        const newTag = new Tag();
        newTag.name = tagDto.name;
        newTag.tenantId = user.tenantId;

        return this.tagRepository.save(newTag);
    }

    async delete(id: number, tenantId: string) {
        await this.tagRepository.findOneByOrFail({ tenantId, id }).catch(() => {
            this.logger.error(`Cannot find tag with id ${id} in tenant with id ${tenantId}`);
            throw new BadRequestException('Cannot find a tag');
        });

        return this.tagRepository.delete(id);
    }
}
