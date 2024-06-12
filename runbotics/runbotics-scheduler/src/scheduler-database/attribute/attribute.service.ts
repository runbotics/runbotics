import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) { }

  create(createAttributeDto: CreateAttributeDto) {
    return this.attributeRepository.save(createAttributeDto);
  }

  findAll() {
    return this.attributeRepository.find();
  }

  findOneById(id: string) {
    return this.attributeRepository.findOne({
      where: {
        id,
      }
    });
  }

  update(id: string, updateAttributeDto: UpdateAttributeDto) {
    return this.attributeRepository.save({ ...updateAttributeDto, id });
  }

  remove(id: string) {
    return this.attributeRepository.delete(id);
  }
}
