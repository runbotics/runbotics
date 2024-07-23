import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CredentialTemplateAttribute } from './credential-template-attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCredentialTemplateAttributeDto } from './dto/update-credential-template-attribute.dto';

const relations = ['template'];

@Injectable()
export class CredentialTemplateAttributeService {
    constructor(
        @InjectRepository(CredentialTemplateAttribute)
        private readonly templateAttributeRepo: Repository<CredentialTemplateAttribute>,
    ) {}

    async create(createData: Partial<CredentialTemplateAttribute>): Promise<CredentialTemplateAttribute> {
        const newAttribute = this.templateAttributeRepo.create(createData);
        return this.templateAttributeRepo.save(newAttribute);
    }

    async findById(id: string): Promise<CredentialTemplateAttribute> {
        return this.templateAttributeRepo.findOne({
            where: {
                id,
            },
            relations
        });
    }

    async update(id: string, updateData: Partial<CredentialTemplateAttribute>): Promise<CredentialTemplateAttribute> {
        const attributeToUpdate = this.templateAttributeRepo.create({ ...updateData, id });

        return this.templateAttributeRepo.save(attributeToUpdate);
    }

    async updateByNameAndTemplateId(name: string, templateId: string, updateData: UpdateCredentialTemplateAttributeDto): Promise<UpdateCredentialTemplateAttributeDto> {
        const attributeToUpdate = this.templateAttributeRepo.create({ ...updateData, name, templateId });

        return this.templateAttributeRepo.save(attributeToUpdate);
    }

    async deleteById(id: string)  {
        const attribute = await this.findById(id);

        return this.templateAttributeRepo.remove(attribute);
    }
}
