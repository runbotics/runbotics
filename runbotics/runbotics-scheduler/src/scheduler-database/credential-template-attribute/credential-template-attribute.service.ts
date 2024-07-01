import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CredentialTemplateAttribute } from './credential-template-attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCredentialTemplateAttributeDto } from './dto/update-credential-template-attribute.dto';

const relations = ['template'];

@Injectable()
export class CredentialTemplateAttributeService {
    constructor(
        @InjectRepository(CredentialTemplateAttribute)
        private readonly templateAttributeRepository: Repository<CredentialTemplateAttribute>,
    ) {}

    async create(createData: Partial<CredentialTemplateAttribute>): Promise<CredentialTemplateAttribute> {
        const newAttribute = this.templateAttributeRepository.create(createData);
        return this.templateAttributeRepository.save(newAttribute);
    }

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

    async updateByNameAndTemplateId(name: string, templateId: string, updateData: UpdateCredentialTemplateAttributeDto): Promise<UpdateCredentialTemplateAttributeDto> {
        await this.templateAttributeRepository.update({ name, templateId }, updateData);
        return this.templateAttributeRepository.findOne({
            where: {
                name,
                templateId,
            },
            relations
        });
    }

    async deleteById(id: string): Promise<void> {
        await this.templateAttributeRepository.delete(id);
    }
}
