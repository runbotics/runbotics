import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto, createCredentialSchema } from './dto/create-credential.dto';
import { UpdateCredentialDto, updateCredentialSchema } from './dto/update-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { Repository } from 'typeorm';
import { AuthRequest } from '#/types';
import { z } from 'zod';

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>
  ) {}

  create(credentialDto: CreateCredentialDto, request: AuthRequest) {
    const { user: { id: userId } } = request;

    const parsedCredentialDto = createCredentialSchema.safeParse(credentialDto);

    if(!parsedCredentialDto.success) {
      throw new BadRequestException(parsedCredentialDto.error.format());
    }

    const credential = {
      ...parsedCredentialDto.data,
      createdById: userId
    };

    return this.credentialRepo.save(credential)
      .then((savedCredential) => savedCredential)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  findAllUserAccessible(request: AuthRequest) {
    const { user: { id: userId, tenantId } } = request;
    return this.credentialRepo.find({
      where: {
        tenantId
        // @todo has access to by shared collection
      }
    });
  }

  findAllByCollectionId(collectionId: string) {
    return this.credentialRepo.find({
      where: {
        collectionId
      }
    });
  }

  findOneById(id: string) {
    return this.credentialRepo.findOne({
      where: {
        id
      }
    });
  }

  updateById(id: string, credentialDto: UpdateCredentialDto) {
    const parsedCredentialDto = updateCredentialSchema.parse(credentialDto);

    if (!parsedCredentialDto) {
        throw new BadRequestException(`Invalid credential data. Allowed properties: ${updateCredentialSchema.shape}`);
    }

    return this.credentialRepo.update(id, parsedCredentialDto);
  }

  async removeById(id: string) {
    const credential = await this.findOneById(id);

    if (!credential) {
      throw new NotFoundException(`Credential with id ${id} not found`);
    }

    return this.credentialRepo.remove(credential);
  }
}
