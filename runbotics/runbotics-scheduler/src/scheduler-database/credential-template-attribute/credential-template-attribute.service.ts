import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CredentialTemplateAttribute } from './credential-template-attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';

const relations = ['template'];

@Injectable()
export class CredentialTemplateAttributeService {
    constructor(
        @InjectRepository(CredentialTemplateAttribute)
        private readonly templateAttributeRepository: Repository<CredentialTemplateAttribute>,
    ) {}

    async findById(id: string): Promise<CredentialTemplateAttribute> {
        return this.templateAttributeRepository.findOne({
            where: {
                id,
            },
            relations
        });
    }

    async update(id: string, updateData: Partial<CredentialTemplateAttribute>): Promise<CredentialTemplateAttribute> {
        await this.templateAttributeRepository.update(id, updateData);
        return this.findById(id);
    }

    async deleteById(id: string): Promise<void> {
        await this.templateAttributeRepository.delete(id);
    }

    async create(createData: Partial<CredentialTemplateAttribute>): Promise<CredentialTemplateAttribute> {
        const newAttribute = this.templateAttributeRepository.create(createData);
        return this.templateAttributeRepository.save(newAttribute);
    }

}
