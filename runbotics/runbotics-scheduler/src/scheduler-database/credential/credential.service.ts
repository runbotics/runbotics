import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { Repository } from 'typeorm';
import { AuthRequest } from '#/types';

const relations = ['attributes'];

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>
  ) {}

  create(credentialDto: CreateCredentialDto, request: AuthRequest) {
    const { user: { id: userId, tenantId } } = request;

    const credential = this.credentialRepo.create({
      ...credentialDto,
      createdById: userId,
      updatedById: userId,
      tenantId
    });

    return this.credentialRepo.save(credential)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  findAllAccessibleByCollectionId(request: AuthRequest) {
    const { user: { id: userId, tenantId } } = request;
    return this.credentialRepo.find({
      where: {
        tenantId
        // @todo has access to by shared collection
      },
      relations
    });
  }

  findOneById(id: string) {
    return this.credentialRepo.findOne({
      where: {
        id
      },
      relations
    });
  }

  findOneByIdAndTenantId(id: string, tenantId: string) {
    return this.credentialRepo.findOne({
      where: {
        id,
        tenantId
      },
      relations
    });
  }

  updateById(id: string, credentialDto: UpdateCredentialDto, request: AuthRequest) {
    const { user: { id: userId }} = request;

    const credentialToUpdate = this.credentialRepo.create({ ...credentialDto, id, updatedById: userId });

    return this.credentialRepo.save(credentialToUpdate);
  }

  async removeById(id: string) {
    const credential = await this.findOneById(id);

    return this.credentialRepo.remove(credential);
  }
}
